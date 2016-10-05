$(function(){
   var audio= $('audio').get(0)
    audio.play();
     $('.music').on('click',function(){
      audio.pause();
    })
    var canvas=$('canvas').get(0);
    var ctx=canvas.getContext('2d');
    //画布的宽度
    var width=canvas.width;
    var ROW=15;
    //每一格的宽度
    var off=width/15;
    var flag=true;
    //创建一个空表，存放棋子位置；
    var blocks={};
    //5个小黑圆
    function drawCircle(x, y){
        ctx.beginPath();
        ctx.arc(x*off+0.5,y*off+0.5,4,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    //绘制棋盘
    function draw(){
    //横线
        ctx.beginPath();
        for(i=0;i<ROW;i++){
            //0.5是消除双像素线的
            ctx.moveTo(off/2+0.5,off/2+0.5+i*off);
            // ctx.lineTo((ROW-0.5)*off,off/2+0.5+i*off)
            ctx.lineTo(width-off/2+0.5,off/2+0.5+i*off);
            ctx.stroke();
        }
        ctx.closePath();

        //竖线
        ctx.beginPath();
        for(var j=0;j<ROW;j++){
            ctx.moveTo(off/2+0.5+j*off,off/2+0.5);
            ctx.lineTo(off/2+0.5+j*off,width-off/2+0.5);
            ctx.stroke();
        }
        ctx.closePath();

        //小黑点
        drawCircle(3.5,3.5);
        drawCircle(11.5,3.5);
        drawCircle(7.5,7.5);
        drawCircle(3.5,11.5);
        drawCircle(11.5,11.5);
    }
    //棋子
    // var img = new Image();
    function drawChess(x,y,color){
        ///改变原点
        ctx.save();
        ctx.translate((x+0.5)*off+0.5,(y+0.5)*off+0.5);
        ctx.beginPath();


        if(color==='black'){
            // img.src = 'img/heiqi.png';
            // ctx.drawImage(img, -15, -15, 30, 30);
            var radgrad1=ctx.createRadialGradient(-6,-6,1,0,0,17);
            radgrad1.addColorStop(0,'#fff');
            radgrad1.addColorStop(0.9,'#000');
            radgrad1.addColorStop(1,'rgba(255,255,255,0.2)');
            ctx.fillStyle=radgrad1;
            blocks[x+'_'+y]='black';

        }else if(color==='white'){
            // img.src = 'img/baiqi.png';
            // ctx.drawImage(img, -15, -15, 30, 30);
            var radgrad1=ctx.createRadialGradient(-3,-3,1,0,0,17);
            radgrad1.addColorStop(0,'rgba(255,255,255,0.95)');
            radgrad1.addColorStop(1,'#fff');
            // radgrad1.addColorStop(1,'rgba(255,255,255,0.2)');
            ctx.fillStyle=radgrad1;
            ctx.shadowOffsetX=2;
            ctx.shadowOffsetY=2;
            ctx.shadowBlur=1;
            ctx.shadowColor='black';
            // ctx.fillStyle='orange';
            blocks[x+'_'+y]='white';

        }
        ctx.arc(0,0,15,0,2*Math.PI);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }
    function check(pos,color) {
        var rownum = 1,
            colnum=1,
            leftnum=1,
            rightnum=1;
        var table={};
        tx = pos.x;
        ty = pos.y;
        // console.log(tx+'_'+ty);
        for(var i in blocks){
            if(blocks[i]===color) {
                table[i] = color;
            }
        }
        //如果是白棋，table里就是白棋
        // 如果是黑棋，table里就是黑棋
        // console.log(table)
        //横向的
        while(table[tx+1+'_'+ty]){
            rownum++; tx++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[tx-1+'_'+ty]){
           rownum++;tx--;
        }
        // return rownum>=5;
        //竖向的
        tx=pos.x;
        ty=pos.y;
        while(table[tx+'_'+(ty-1)]){
            colnum++;
            ty--;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[tx+'_'+(ty+1)]){
            colnum++;
            ty++;
        };

        ////////
        tx=pos.x;
        ty=pos.y;
        while(table[(tx-1)+'_'+(ty-1) ] ){
            leftnum++;
            ty--;
            tx--;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[(tx+1)+'_'+(ty+1)]){
            leftnum++;
            ty++;
            tx++;
        }
        ///////

        tx=pos.x;
        ty=pos.y;
        while(table[(tx+1)+'_'+(ty-1) ] ){
            rightnum++;
            ty--;
            tx++;
        }
        tx=pos.x;
        ty=pos.y;
        while(table[(tx-1)+'_'+(ty+1)]){
            rightnum++;
            ty++;
            tx--;
        }
        return rownum>=5||colnum>=5||leftnum>=5||rightnum>=5;
    }

    function k2o(key){
        var arr=key.split('_');
        // console.log(arr)
        return {x:parseInt(arr[0]),y:parseInt(arr[1])}
    };
        //生成棋谱
    function review(){
        var i=1;
        for (var pos in blocks){
            drawText(k2o(pos),i,blocks[pos]);
            i++;
        }
    }
    //绘制文本
    function drawText(pos, text, color){
        ctx.save();
        //设置字大小，字体，水平居中，垂直居中
        ctx.font='15px 微软雅黑';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        //如果棋子是黑色，字的颜色为白
        if(color==='black'){
            ctx.fillStyle='white';
        }else if(color==='white'){
            ctx.fillStyle='black';
        }
        ctx.fillText(text,(pos.x + 0.5)*off,(pos.y + 0.5)*off);
        ctx.restore();
    }

    //第一次落的是黑棋，第二次落的是白棋
    function handleclick(e){
        var position={
            //获取到左边的位置-外边距/间距  4,4
            x:Math.round((e.offsetX-off/2)/off),
            y:Math.round((e.offsetY-off/2)/off)
        };
        //两个棋子不能放到一起
        if(blocks[position.x+'_'+position.y]){
            return;
        }
        if(flag){
            //落子
            drawChess(position.x,position.y,'black');
            //判断输赢
            if(check(position,'black')){
                // alert('黑棋赢!');
                $('.heiqiying').css({display:'block'})
                $('.qipu').on('click',function(){
                    $('.heiqiying').css({display:'none'})
                    review();
                });
                $('.zailai').on('click',function(){
                    $('.heiqiying').css({display:'none'})
                    reset();
                    draw();
                    $(canvas).on('click',handleclick);

                });
                $(canvas).off('click');
                return;
            }
        }else{
            drawChess(position.x,position.y,'white');
            if(check(position,'white')){
               // alert('白棋赢')
                    $('.baiqiying').css({display:'block'})
                    $('.qipu').on('click',function(){
                        $('.baiqiying').css({display:'none'})
                        review();
                    })
                    $('.zailai').on('click',function(){
                    $('.baiqiying').css({display:'none'})
                    reset();
                    draw();
                    $(canvas).on('click',handleclick);
                })
                $(canvas).off('click');
                return;
            }
        }
        flag=!flag;
    }
    draw();
    function reset(){
        ctx.clearRect(0,0,width,width);
        blocks={};
        flag=true;
    }
    $(canvas).on('click',handleclick);
    $('.start').on('click',function(){
        reset();
        $(canvas).off('click').on('click',handleclick);
        draw();
        // $('.img').addClass('active')
      });  
    $('.end').on('click',function(){
        reset();
        $(canvas).off('click')
        draw();
    })
 
    ////////////////////////
    var biao=$('.biao').get(0);
    var ctx2=biao.getContext('2d');
    function miaobiao(){
        ctx2.clearRect(0,0,100,100);
        ctx2.beginPath();
        ctx2.save();
        ctx2.translate(50,50);
        ctx2.beginPath();
        var date=new Date();
        var s=date.getSeconds();
        ctx2.rotate(2*Math.PI*s/60);
        ctx2.moveTo(0,20);
        ctx2.lineTo(0,0);
        ctx2.stroke();
        ctx2.moveTo(5,0);
        ctx2.arc(0,0,5,0,Math.PI*2)
        ctx2.fill();
        ctx2.moveTo(0,-5);
        ctx2.lineTo(0,-35);
        ctx2.stroke();
        ctx2.closePath();
        ctx2.restore();
    }

    setInterval(miaobiao,1000)

});