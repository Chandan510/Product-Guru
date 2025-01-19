import praw
from astrapy import DataAPIClient
import googleapiclient.discovery
from flask import Flask, request, jsonify
import requests
from flask_cors import CORS  # Import CORS
from dotenv import load_dotenv
import os

load_dotenv()

# Flask App Initialization
app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This will allow all domains to access your API

# Initialize Astra DB Client
ASTRA_DB_CLIENT = DataAPIClient(os.getenv('VITE_ASTRA_DB_CLIENT'))
DB = ASTRA_DB_CLIENT.get_database_by_api_endpoint(
    os.getenv('VITE_ASTRA_DB_CLIENT_ENDPOINT')
)
COLLECTION = DB.get_collection("redditcollection")

# Langflow API Configuration
LANGFLOW_API_URL = os.getenv('VITE_LANGFLOW_API_URL')
APPLICATION_TOKEN = os.getenv('VITE_APPLICATION_TOKEN')

# Initialize Reddit API Client
REDDIT = praw.Reddit(
    client_id=os.getenv('VITE_REDDIT_CLIENT_ID'),
    client_secret=os.getenv('VITE_REDDIT_SECREATE'),
    user_agent=os.getenv('VITE_REDDIT_USER_AGENT')
)

# Initialize YouTube API Client
YOUTUBE = googleapiclient.discovery.build("youtube", "v3", developerKey=os.getenv('VITE_YOUTUBE_DEVELOPER_KEY'))


def search_reddit(query, limit=10):
    """Fetches Reddit data based on query."""
    submissions = REDDIT.subreddit("all").search(query, limit=limit)
    return [
        {
            "title": submission.title,
            "url": submission.url,
            "reddit_id": submission.id,  # Include reddit_id
            "comments": submission.num_comments,
        }
        for submission in submissions
    ]


def search_youtube(query, max_results=10):

    request = YOUTUBE.search().list(
        part="snippet",
        maxResults=max_results,
        q=query
    )
    response = request.execute()
    return [
        {
            "video_id": item["id"]["videoId"],
            "title": item["snippet"]["title"],
            "url": f"<a>https://www.youtube.com/watch?v={item['id']['videoId']}</a>",
            "description": item["snippet"]["description"],
        }
        for item in response["items"]
    ]


def store_in_db_unique(data, platform):
    for entry in data:
        if platform == 'reddit':
            # Check for duplicate based on reddit_id
            existing_entry = COLLECTION.find_one({'reddit_id': entry['reddit_id']})
        else:
            # Check for duplicate based on video_id for YouTube
            existing_entry = COLLECTION.find_one({'video_id': entry['video_id']})
        
        if not existing_entry:
            # If not found, insert the new data
            COLLECTION.insert_one(entry)
        else:
            print(f"Duplicate found for {entry['reddit_id' if platform == 'reddit' else 'video_id']}. Skipping insertion.")


def call_langflow_api(message):

    payload = {
        "input_value": message,
        "output_type": "chat",
        "input_type": "chat",
    }
    headers = {
        "Authorization": f"Bearer {APPLICATION_TOKEN}",
        "Content-Type": "application/json"
    }
    response = requests.post(LANGFLOW_API_URL, json=payload, headers=headers)
    
 
    message = response.json().get("outputs", [{}])[0].get("outputs", [{}])[0].get("artifacts", {}).get('message', '')
    
    return message


@app.route("/search", methods=["GET"])
def search():
    """Main endpoint to fetch and process data."""
    query = request.args.get("query")
    if not query:
        return jsonify({"error": "Query parameter is required"}), 400

    reddit_data = search_reddit(query)
    youtube_data = search_youtube(query)

    store_in_db_unique(reddit_data, "reddit")
    store_in_db_unique(youtube_data, "youtube")


    message = call_langflow_api(query)
    
    return jsonify({"question": query, "answer": message})


if __name__ == "__main__":
    app.run(debug=False)
    