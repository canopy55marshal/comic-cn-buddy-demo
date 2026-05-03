module.exports = {
  apps: [
    {
      name: "comic-con-buddy-backend",
      script: "dist/main.js",
      cwd: "/var/www/comic-con-buddy/backend",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
};
