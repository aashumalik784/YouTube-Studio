// frontend/src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    fetchYouTubeData();
  }, []);

  const fetchYouTubeData = async () => {
    try {
      const response = await axios.get('/api/youtube/stats');
      setStats(response.data.stats);
      setVideos(response.data.videos);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const chartData = {
    labels: stats.viewsTimeline,
    datasets: [{
      label: 'Views',
      data: stats.viewsData,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  };

  return (
    <div className="dashboard">
      <h1>YouTube Studio Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{stats.totalViews}</h3>
          <p>Total Views</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalSubscribers}</h3>
          <p>Subscribers</p>
        </div>
        <div className="stat-card">
          <h3>{stats.totalVideos}</h3>
          <p>Videos</p>
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} />
      </div>

      <div className="videos-section">
        <h2>Recent Videos</h2>
        {videos.map(video => (
          <div key={video.id} className="video-item">
            <h3>{video.title}</h3>
            <p>Views: {video.views}</p>
            <p>Published: {new Date(video.publishDate).toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
