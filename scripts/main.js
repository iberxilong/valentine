;(function (window) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame

  const FRAME_RATE = 60
  const PARTICLE_NUM = 2000
  const RADIUS = Math.PI * 2
  const CANVASWIDTH = 1200
  const CANVASHEIGHT = 300
  const CANVASID = 'canvas'
  // 该js文件主要功能是在网页上通过粒子系统动画生成和更新一系列预定义的文本。
  // 这些文本被显示在一个<canvas>元素上，并且每次点击或触摸屏幕时，文本会更新到数组texts中的下一个文本。
  let texts = ['&EnCounter','Dear 懒狗睡睡睡', 'Milktea 学妹','Lovely XX','since 2023/11/26','Our growing bond ,', 'tender and new,','blossoms like a garden','in the sun\'s warm embrace;','like a new star,','hints at a luminous future', 'with shared laughter', 'under the moon.', 'HAPPY',  'VALENTINE\'S', 'DAY','YOURS ZanYu With love',"SHOW_ALL_TEXTS"]

  let canvas,
    ctx,
    particles = [],
    quiver = true,
    text = texts[0],
    textIndex = 0,
    textSize = 80

  function draw () {
    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)
    ctx.fillStyle = 'rgb(255, 255, 255)'
    ctx.textBaseline = 'middle'
    ctx.fontWeight = 'bold'
    ctx.font = textSize + 'px \'SimHei\', \'Avenir\', \'Helvetica Neue\', \'Arial\', \'sans-serif\''
    ctx.fillText(text, (CANVASWIDTH - ctx.measureText(text).width) * 0.5, CANVASHEIGHT * 0.5)

    //wrapText(text, CANVASWIDTH / 2, CANVASHEIGHT / 2, CANVASWIDTH, textSize);

    let imgData = ctx.getImageData(0, 0, CANVASWIDTH, CANVASHEIGHT)

    ctx.clearRect(0, 0, CANVASWIDTH, CANVASHEIGHT)

    for (let i = 0, l = particles.length; i < l; i++) {
      let p = particles[i]
      p.inText = false
    }
    particleText(imgData)

    window.requestAnimationFrame(draw)
  }

  function wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let lineCount = 0;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;

        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x - (ctx.measureText(line).width / 2), y);
            line = words[n] + ' ';
            y += lineHeight;
            lineCount++;
            if (lineCount >= 2) break; // 限制最多两行
        } else {
            line = testLine;
        }
      }
      ctx.fillText(line, x - (ctx.measureText(line).width / 2), y); // 绘制最后一行或仅有的一行
  }
  function particleText (imgData) {
    // 点坐标获取
    var pxls = []
    for (var w = CANVASWIDTH; w > 0; w -= 3) {
      for (var h = 0; h < CANVASHEIGHT; h += 3) {
        var index = (w + h * (CANVASWIDTH)) * 4
        if (imgData.data[index] > 1) {
          pxls.push([w, h])
        }
      }
    }

    var count = pxls.length
    var j = parseInt((particles.length - pxls.length) / 2, 10)
    j = j < 0 ? 0 : j

    for (var i = 0; i < pxls.length && j < particles.length; i++, j++) {
      try {
        var p = particles[j],
          X,
          Y

        if (quiver) {
          X = (pxls[i - 1][0]) - (p.px + Math.random() * 10)
          Y = (pxls[i - 1][1]) - (p.py + Math.random() * 10)
        } else {
          X = (pxls[i - 1][0]) - p.px
          Y = (pxls[i - 1][1]) - p.py
        }
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)
        p.x = p.px + C * T * p.delta
        p.y = p.py + S * T * p.delta
        p.px = p.x
        p.py = p.y
        p.inText = true
        p.fadeIn()
        p.draw(ctx)
      } catch (e) {}
    }
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i]
      if (!p.inText) {
        p.fadeOut()

        var X = p.mx - p.px
        var Y = p.my - p.py
        var T = Math.sqrt(X * X + Y * Y)
        var A = Math.atan2(Y, X)
        var C = Math.cos(A)
        var S = Math.sin(A)

        p.x = p.px + C * T * p.delta / 2
        p.y = p.py + S * T * p.delta / 2
        p.px = p.x
        p.py = p.y

        p.draw(ctx)
      }
    }
  }

  function setDimensions () {
    canvas.width = CANVASWIDTH
    canvas.height = CANVASHEIGHT
    canvas.style.position = 'absolute'
    canvas.style.left = '0%'
    canvas.style.top = '0%'
    canvas.style.bottom = '0%'
    canvas.style.right = '0%'
    canvas.style.marginTop = window.innerHeight * .15 + 'px'
  }

  function showAllTexts() {
    // 创建一个新的 div 元素来显示所有文本，除了特殊元素
    const textsDiv = document.createElement('div');
    textsDiv.setAttribute('id', 'allTexts');
    textsDiv.style.color = 'rgb(226,225,142)'; // 示例颜色，根据需要调整
    textsDiv.style.whiteSpace = 'pre-wrap'; // 保持文本格式
    textsDiv.style.padding = '20px'; // 添加一些内边距
    textsDiv.style.textAlign = 'center'; // 文本居中
    textsDiv.style.cursor = 'text'; // 显示文本光标
    textsDiv.style.position = 'absolute'; // 绝对定位
    textsDiv.style.left = '50%'; // 左边距设置为50%宽度
    textsDiv.style.top = '50%'; // 顶边距设置为50%高度
    textsDiv.style.transform = 'translate(-50%, -50%)'; // 使用 transform 属性来确保元素完全居中
    textsDiv.style.maxWidth = '90%'; // 最大宽度，确保有足够的边距
    textsDiv.style.overflow = 'auto'; // 如果文本太多，允许滚动

    // 过滤掉特殊元素并将剩余文本拼接成一个字符串
    const allTexts = texts.filter(t => t !== "SHOW_ALL_TEXTS").join('\n\n');
    textsDiv.textContent = allTexts;

    // 将新的 div 添加到页面上
    document.body.appendChild(textsDiv);
}


  function event () {
    const eventHandler = function (e) {
      textIndex++;
      if (textIndex < texts.length) {
          text = texts[textIndex];
          console.log(textIndex);
          
          // 检查是否到达特殊元素
          if (text === "SHOW_ALL_TEXTS") {
              showAllTexts(); // 展示所有文本
              canvas.style.display = 'none'; // 隐藏 canvas
          }
      }
  };
  
    // document.addEventListener('click', function (e) {
    //   textIndex++
    //   if (textIndex >= texts.length) {
    //     textIndex--
    //     return
    //   }
    //   text = texts[textIndex]
    //   console.log(textIndex)
    // }, false)
    document.addEventListener('click', eventHandler, false)

    // document.addEventListener('touchstart', function (e) {
    //   textIndex++
    //   if (textIndex >= texts.length) {
    //     textIndex--
    //     return
    //   }
    //   text = texts[textIndex]
    //   console.log(textIndex)
    // }, false)
    document.addEventListener('touchstart', eventHandler, false)
  }

  
  function init () {
    canvas = document.getElementById(CANVASID)
    if (canvas === null || !canvas.getContext) {
      return
    }
    ctx = canvas.getContext('2d')
    setDimensions()
    event()

    for (var i = 0; i < PARTICLE_NUM; i++) {
      particles[i] = new Particle(canvas)
    }

    draw()
  }

  class Particle {
    constructor (canvas) {
      let spread = canvas.height
      let size = Math.random() * 1.2
      // 速度
      this.delta = 0.06
      // 现在的位置
      this.x = 0
      this.y = 0
      // 上次的位置
      this.px = Math.random() * canvas.width
      this.py = (canvas.height * 0.5) + ((Math.random() - 0.5) * spread)
      // 记录点最初的位置
      this.mx = this.px
      this.my = this.py
      // 点的大小
      this.size = size
      // this.origSize = size
      // 是否用来显示字
      this.inText = false
      // 透明度相关
      this.opacity = 0
      this.fadeInRate = 0.005
      this.fadeOutRate = 0.03
      this.opacityTresh = 0.98
      this.fadingOut = true
      this.fadingIn = true
    }
    fadeIn () {
      this.fadingIn = this.opacity > this.opacityTresh ? false : true
      if (this.fadingIn) {
        this.opacity += this.fadeInRate
      }else {
        this.opacity = 1
      }
    }
    fadeOut () {
      this.fadingOut = this.opacity < 0 ? false : true
      if (this.fadingOut) {
        this.opacity -= this.fadeOutRate
        if (this.opacity < 0) {
          this.opacity = 0
        }
      }else {
        this.opacity = 0
      }
    }
    draw (ctx) {
      ctx.fillStyle = 'rgba(226,225,142, ' + this.opacity + ')'
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, RADIUS, true)
      ctx.closePath()
      ctx.fill()
    }
  }
  
  var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if(!isChrome){
      $('#iframeAudio').remove()
  }
  
  // setTimeout(() => {
    init()  
  // }, 4000);
  // mp3.play()
})(window)
