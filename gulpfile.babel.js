import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import gulp from 'gulp';
import postcss from 'gulp-postcss';
import rename from 'gulp-rename';
import sass from 'gulp-sass';
import sassCompiler from 'sass';

sass.compiler = sassCompiler;

const { NODE_ENV = 'development' } = process.env;
const inProduction = NODE_ENV === 'production';

// Build CSS
export function build() {
    let processors = [ autoprefixer ];

    if (inProduction) processors.push(cssnano);

    let task = gulp.src('chassis.scss')
        .pipe(sass())
        .pipe(postcss(processors));

    if (inProduction) task = task.pipe(rename({ suffix: '.min' }));

    return task.pipe(gulp.dest('build'));
}

// Watch for changes and build CSS
export const develop = () => gulp.watch('*.scss', build);