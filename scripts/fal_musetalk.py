import os
import sys
from dotenv import load_dotenv
import fal_client

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

load_dotenv('rais-website/.env')
load_dotenv('.env')

MODEL_ID = "fal-ai/musetalk"

def generate_lip_sync(source_video_path: str, audio_path: str, output_path: str):
    """
    Submits a lip-sync generation job to fal.ai/musetalk using the fal_client SDK.
    Uploads local source video and audio to fal storage, calls the model,
    and downloads the generated video to output_path.
    """
    if not os.environ.get("FAL_KEY"):
        raise ValueError("FAL_KEY environment variable is missing. Please check .env.")
        
    if not os.path.exists(source_video_path):
        raise FileNotFoundError(f"Source video not found: {source_video_path}")
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")
        
    print(f"Uploading assets to fal storage...")
    source_video_url = fal_client.upload_file(source_video_path)
    audio_url = fal_client.upload_file(audio_path)
    print(f"  ✓ Video uploaded")
    print(f"  ✓ Audio uploaded")
    
    print(f"Submitting job to {MODEL_ID}...")
    handler = fal_client.submit(
        MODEL_ID,
        arguments={
            "source_video_url": source_video_url,
            "audio_url": audio_url
        }
    )
    
    print(f"Job submitted! Request ID: {handler.request_id}")
    print("Waiting for generation to complete...")
    result = handler.get()
    
    video_info = result.get("video")
    if not video_info or "url" not in video_info:
        raise RuntimeError(f"Unexpected response from {MODEL_ID}: {result}")
        
    result_url = video_info["url"]
    print(f"Downloading finished video from: {result_url}")
    
    import urllib.request
    os.makedirs(os.path.dirname(os.path.abspath(output_path)), exist_ok=True)
    urllib.request.urlretrieve(result_url, output_path)
    print(f"🎉 Lip-synced video saved to: {output_path} ({os.path.getsize(output_path)} bytes)")
    return output_path

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python fal_musetalk.py <source_video> <audio_path> <output_path>")
        sys.exit(1)
    generate_lip_sync(sys.argv[1], sys.argv[2], sys.argv[3])
