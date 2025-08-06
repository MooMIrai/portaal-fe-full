// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'auth',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-auth',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot'] // <-- CORRETTO
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production'] // <-- CORRETTO
      }
    },
    {
      name: 'chatbot',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-chatbot',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'common',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-common',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'core',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-core',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'dashboard',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-dashboard',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'dashboard-editor',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-dashboard-editor',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'hr',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-hr',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'lookups',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-lookUps',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'notifications',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-notifications',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'personal-area',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-personalarea',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'recruiting',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-recruiting',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'report-editor',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-reporteditor',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'reports',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-reports',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'sales',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-sales',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    },
    {
      name: 'stock',
      namespace: 'portaal-fe',
      script: './node_modules/.bin/webpack',
      cwd: './portaal-fe-stock',
      watch: false,
      autorestart: true,
      env_development: {
        NODE_ENV: 'development',
        args: ['serve', '--mode', 'development', '--live-reload', '--hot']
      },
      env_live: {
        NODE_ENV: 'production',
        args: ['serve', '--mode', 'production']
      }
    }
  ]
};