# gulptest
gulp+less

下载代码地址：https://github.com/lianbinghua/gulptest

切换目录：cd gulptest

安装依赖包：npm install

编译文件：gulp

gulp: 默认启动gulp default,执行testLess，scripts，images任务。

gulp watch: 监听.less，.js,image的变化，并执行testLess，scripts，images任务。

还可以单独执行以下任务：

gulp testLess

gulp scripts

gulp images

你会看到，gulptest下多出一个dist文件夹，目录结构如下：

gulptest

     dist
     
        css
        
           index.css
           
           index.min.css
           
        js
        
           main.js
           
           main.min.js
           
        img
        
          *.jpg
    src
    
       less
       
         index.less
         
       scripts
       
         index.js
         
         main.js
         
       images
       
         *.jpg

dist文件夹下有css，js，img对应src下的less，scripts,images文件夹

css文件夹下有index.css,index.min.css

js文件夹下有main.js,mian.min.css

img文件夹下有 *.jpg

//定义一个testLess任务（自定义任务名称）

//当less有各种引入关系时，编译后不容易找到对应less文件，所以需要生成sourcemap文件，方便修改

//PostCSS插件： Autoprefixer (处理浏览器私有前缀)， cssnext (使用CSS未来的语法), precss (像Sass的函数)。

gulp.task('testLess', function () { 

	var processors=[
         autoprefixer({browsers:['last 3 version'],cascade:false,remove:false}),
         cssnext(),
         cssgrace
	];
  
    
    
    gulp.src('src/less/index.less') //该任务针对的文件 
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(sourcemaps.init())
        .pipe(less()) //该任务调用的模块       
        .pipe(postcss(processors))  
        .pipe(sourcemaps.write())      
        .pipe(gulp.dest('dist/css')) //将会在src/css下生成index.css
        .pipe(rename({suffix:'.min'}))
        .pipe(minifycss())//压缩css兼容IE7及以下需设置compatibility属性 .pipe(cssmin({compatibility: 'ie7'}))
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

//jshintjs文件有没有报错或警告
//concat合并js文件
//uglify压缩js
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


//cache压缩过的图片，不再压缩
//imagemin压缩图片

gulp.task("images",function(){
      gulp.src("src/images/**/*")
          .pipe(cache(imagemin({optimizationLevel:5,progressive:true,interlaced:true})))
          .pipe(gulp.dest('dist/img'))
          .pipe(notify({message:'images task complete'}))
});



 

