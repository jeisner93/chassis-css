import autoprefixer from 'autoprefixer';
import cssnano      from 'cssnano';
import filter       from 'gulp-filter';
import gulp         from 'gulp';
import header       from 'gulp-header';
import pkg          from './package.json';
import postcss      from 'gulp-postcss';
import rename       from 'gulp-rename';
import transpile    from 'gulp-sass';
import sassCompiler from 'sass';

transpile.compiler = sassCompiler;

const { NODE_ENV = 'development' } = process.env;

// Compile the SASS to CSS
export function css() {
    // Initialize the processors,...
    let processors = [ autoprefixer ];
    // ... the banner,...
    let banner = '/*! <%= pkg.name %> <%= pkg.version %> | <%= pkg.license %> License | <%= pkg.homepage %> */';
    // ... and rename options
    let options = {};

    // Depending on what type of assets are being built, change the initial variables
    switch (NODE_ENV) {
        case 'development':
            banner += '\n\n'; // Provide additional spacing below the banner on development CSS
            break;
        case 'production':
            processors.push(cssnano); // Use CSS Nano on production CSS
            options.suffix = '.min';  // Add the ".min" suffix to the production CSS file name
    }

    return gulp.src('src/*.sass')
        .pipe(transpile())             // Transpile the SASS to CSS
        .pipe(postcss(processors))     // Process the CSS with PostCSS
        .pipe(header(banner, { pkg })) // Add a header to the CSS
        .pipe(rename(options))         // Rename the CSS file
        .pipe(gulp.dest('dist/css'));  // Move the CSS to the correct location
};

// Package the SASS to be reusable
export function sass() {
    // Store the name of the main file
    const mainFile = filter([ 'src/chassis.sass' ], { restore: true });

    // For each file in the source directory...
    return gulp.src('src/**/*')
        .pipe(mainFile)                // If currently processing the main file,...
        .pipe(rename({ prefix: '_' })) // ... prefix its file name with "_"
        .pipe(mainFile.restore)
        .pipe(gulp.dest('dist/sass')); // Copy the files to the correct location
};

// Build all assets (CSS and SASS)
export const build = gulp.series(gulp.parallel(css, sass));

// Watch for changes and build CSS
export const develop = () => gulp.watch('src/**/*', css);