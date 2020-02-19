(function (window) {
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype={
        constructor:Progress,
        init:function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove:false,
        progressClick:function (callBack) {
            let $this = this;//这里是progress调用的，此时的this是progress
            //监听背景的点击
            this.$progressBar.click(function (event) {//这里面是click调用的，此时的this是progressBar
                event = window.event || event;
                //获取背景距离窗口的默认位置
                let normalLeft = $(this).offset().left;
                //获取点击位置距离窗口的位置
                let eventLeft = event.pageX;
                //设置前景的宽度
                $this.$progressLine.css("width",eventLeft - normalLeft);
                $this.$progressDot.css("left",eventLeft - normalLeft);
                //计算进度条的比例
                let value = (eventLeft - normalLeft)/$(this).width();
                callBack(value);
            });
        },
        progressMove:function (callBack) {
            let $this = this;
            //1.监听鼠标的按下事件
            //获取背景距离窗口的默认位置
            let normalLeft = this.$progressBar.offset().left;
            let barWidth = this.$progressBar.width();
            let eventLeft;
            this.$progressBar.mousedown(function () {
                $this.isMove = true;
                //2.监听鼠标的移动事件(为了提高用户体验，用文档来监听移动事件。若用进度条监听，则鼠标只能在进度条中移动)
                $(document).mousemove(function (event) {
                    event = window.event || event;
                    //获取点击位置距离窗口的位置
                    eventLeft = event.pageX;
                    let offset = eventLeft - normalLeft;
                    if(offset >= 0 && offset <= barWidth ){
                        //设置前景的宽度
                        $this.$progressLine.css("width",eventLeft - normalLeft);
                        $this.$progressDot.css("left",eventLeft - normalLeft);
                    }
                });
            });

            //3.监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                //计算进度条的比例
                let value = (eventLeft - normalLeft)/$this.$progressBar.width();
                callBack(value);
            });

        },
        setProgress:function (value) {
            if(this.isMove) return;

            if(value < 0 || value > 100) return;
            this.$progressLine.css({
                width: value + "%"
            });
            this.$progressDot.css({
                left: value + "%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype
    window.Progress = Progress;
})(window);