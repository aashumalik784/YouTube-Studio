// backend/src/controllers/youtubeController.js
const axios = require('axios');
const { google } = require('googleapis');
const mongoose = require('mongoose');

const YouTubeAPI = new google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

exports.getChannelStats = async (req, res) => {
  try {
    const response = await YouTubeAPI.channels.list({
      part: 'statistics,snippet',
      id: req.user.channelId
    });

    const stats = response.data.items[0].statistics;
    const videos = await fetchVideoData();

    res.json({
      stats: {
        totalViews: parseInt(stats.viewCount),
        totalSubscribers: parseInt(stats.subscriberCount),
        totalVideos: parseInt(stats.videoCount),
        totalWatchTime: stats.viewCount // Update with actual watch time
      },
      videos: videos.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.fetchVideoData = async () => {
  try {
    const videosResponse = await YouTubeAPI.videos.list({
      part: 'snippet,statistics',
      channelId: process.env.CHANNEL_ID,
      maxResults: 50
    });

    return videosResponse.data.items.map(video => ({
      id: video.id,
      title: video.snippet.title,
      views: parseInt(video.statistics.viewCount),
      publishDate: video.snippet.publishedAt
    }));
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
};
