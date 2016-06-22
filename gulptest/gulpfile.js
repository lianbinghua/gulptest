//导入工具包 require('node_modules里对应模块')
var gulp = require('gulp'), //本地安装gulp所用到的地方
    less = require('gulp-less'),//编译less
    postcss=require('gulp-postcss'),
    autoprefixer=require('autoprefixer'),
    cssgrace=require('cssgrace'),
    cssnext=require('cssnext'),
    rename=require('gulp-rename'),
    minifycss=require('gulp-minify-css'),
    notify=require('gulp-notify'),
    plumber=require('gulp-plumber'),
    jshint=require('gulp-jshint'),
    uglify=require('gulp-uglify'),
    concat=require('gulp-concat'),
    imagemin=require('gulp-imagemin'),
    cache=require('gulp-cache'),
    clean=require('gulp-clean'),
    livereload=require('gulp-livereload'),
    sourcemaps=require('gulp-sourcemaps');

//定义一个testLess任务（自定义任务名称）
gulp.task('testLess', function () {
	var processors=[
         autoprefixer({browsers:['last 3 version'],cascade:false,remove:false}),
         cssnext(),
         cssgrace
	];
  
    //当less有各种引入关系时，编译后不容易找到对应less文件，所以需要生成sourcemap文件，方便修改
    gulp.src('src/less/index.less') //该任务针对的文件 
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(sourcemaps.init())
        .pipe(less()) //该任务调用的模块       
        .pipe(postcss(processors))  
        .pipe(sourcemaps.write())      
        .pipe(gulp.dest('dist/css')) //将会在src/css下生成index.css
        .pipe(rename({suffix:'.min'}))
        .pipe(minifycss())//兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
        .pipe(gulp.dest('dist/css'))
        .pipe(notify({message:'testLess task complete'}));
});

/*gulp.task('css', function () {
	var processors=[
         autoprefixer({browsers:['last 3 version'],cascade:false,remove:false}),
         cssnext(),
         cssgrace
	];
	
    gulp.src('src/css/index.css') //该任务针对的文件        
        .pipe(postcss(processors))
        .pipe(gulp.dest('src/css/test.css')); //将会在src/css下生成index.css
});*/
gulp.task("scripts",function(){
     gulp.src('src/scripts/**/*.js')
         .pipe(jshint())
         .pipe(jshint.reporter('default'))
         .pipe(concat('main.js'))
         .pipe(gulp.dest('dist/js'))
         .pipe(rename({suffix:'.min'}))
         .pipe(uglify())
         .pipe(gulp.dest('dist/js'))
         .pipe(notify({message:'scripts task complete'}));
});

gulp.task("images",function(){
      gulp.src("src/images/**/*")
          .pipe(cache(imagemin({optimizationLevel:5,progressive:true,interlaced:true})))
          .pipe(gulp.dest('dist/img'))
          .pipe(notify({message:'images task complete'}))
});

gulp.task('clean',function(){
      gulp.src(['dist/css','dist/js','dist/img'],{read:false})
          .pipe(clean());
});

gulp.task('watch',function(){
    gulp.watch('src/less/**/*.less',['testLess']);
    gulp.watch('src/scripts/**/*.js',function(){
    	gulp.run('scripts');
    	console.log("scripts");
    });
    gulp.watch('src/images/**/*',function(){
    	gulp.run('images');
    	console.log("images");
    });
});

gulp.task('default',function(){
	gulp.start('testLess','scripts','images');
}); 

//gulp.task(name[, deps], fn) 定义任务  name：任务名称 deps：依赖任务名称 fn：回调函数
//gulp.src(globs[, options]) 执行任务处理的文件  globs：处理的文件路径(字符串或者字符串数组) 
//gulp.dest(path[, options]) 处理完后文件生成路径