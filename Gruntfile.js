module.exports = (grunt) => {
  const {
    file, initConfig, loadNpmTasks, registerTask,
  } = grunt;
  const _banner = '/*! <%= pkg.name %> v<%= pkg.version %> <%= pkg.author %> */';
  const _config = {
    pkg: file.readJSON('package.json'),
    sass: {
      dist: {
        options: {
          style: 'compressed',
          'no-source-map': true,
        },
        files: {
          'public/assets/css/app.min.css': 'src/sass/app.scss',
        },
      },
    },
    uglify: {
      options: {
        banner: `${_banner}\n`,
      },
      files: {
        src: 'src/js/*.js',
        dest: 'public/assets/js/',
        expand: true,
        flatten: true,
        ext: '.min.js',
        extDot: 'last',
      },
    },
    usebanner: {
      css: {
        options: {
          position: 'top',
          banner: _banner,
          linebreak: true,
        },
        files: {
          src: [
            'public/assets/css/app.min.css',
          ],
        },
      },
    },
    watch: {
      css: {
        files: 'src/sass/**/*.scss',
        tasks: ['sass', 'usebanner:css'],
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['uglify'],
      },
    },
  };

  initConfig(_config);
  loadNpmTasks('grunt-banner');
  loadNpmTasks('grunt-contrib-sass');
  loadNpmTasks('grunt-contrib-uglify');
  loadNpmTasks('grunt-contrib-watch');
  registerTask('default', ['sass', 'usebanner:css', 'uglify']);
};
