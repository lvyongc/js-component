// 自定义事件
export default class Dialog extends EventTarget{
    //EventTarget 系统的自定义事件的一个类，是构造函数，创建一个新的 EventTarget 对象实例
    constructor(options){
        // extends 后需要 super
        super();
        // 合并配置

        // let {width='40%',height='300px',title='测试'} = options; 解构给默认参数
        
        // 默认配置:
        let obj = {
            width:'30%',    // 键名：值
            height:'250px',
            title:'测试标题',
            content:'测试内容',
            dragable:false,// 是否可以拖拽
            maskable:true,// 是否有遮罩
            isCancel:true,// 是否有取消
            cancel(){},
            success(){}
        };

        this.opts = Object.assign(obj,options)
        // 把两个对象合并生成一个新对象
        // obj和options合并生产新的对象opts
        // options中有的键名会覆盖obj中的，传进来的覆盖默认
        // console.log(opts)
        // 在类里面的this都会指向类的实例化对象
        this.createHtml()
        this.init()
    }
        init(){
            // 绑定拖拽
            // 判断是否可以拖拽
            if(this.opts.dragable){
                this.dragable();
            }
            
            // 绑定事件
            // this.divEle.querySelector('.k-close').onclick = ()=>{
            //     this.divEle.style.display = 'none'
            // }
            // this.divEle.querySelector('.k-default')&&(this.divEle.querySelector('.k-default').onclick = ()=>{
            //     this.divEle.style.display = 'none'
            // })

            // 绑定自定义事件（解耦，把每个方法之间的依赖关系降低）
            // 这个可以绑定自定义事件是因为， 是继承了EventTarget这个类之后，内部可以使用自定义事件
            this.addEventListener('success',this.opts.success)

            // 事件委托:性能更好，变相的容错
            // 只绑定一次,绑定到上一层，通过判断去执行
            let kDialog = this.divEle.querySelector('.k-dialog');
            kDialog.addEventListener('click',e=>{
                // console.log(e)
                // console.log(e.target)   // 查看点击到的是哪个节点
                switch(e.target.className){
                    case 'k-close' :
                        this.opts.cancel();
                        this.close();
                        break;
                    case 'k-primary' :
                        this.confirm();
                        break;
                    case 'k-default' :
                        this.opts.cancel();
                        this.close();
                            break;
                    default:
                        console.log('无事件')
                        break;
                }
            })
        }
        // 提交
        confirm(value){
            // console.log(value)
            // 回调函数不是由该函数的实现方直接调用，而是在特定的事件或条件发生时由另外的一方调用的，用于对该事件或条件进行响应。
            // this.opts.success(value); 通过回调函数
            
            // 触发自定义事件：先实例化，再派发（触发）事件
            let success = new CustomEvent('success',{
                // detail 带参
                detail:value
            });   
            this.dispatchEvent(success);    // 触发事件对象
            this.close();
        }
        // 关闭对话框
        close(){
            this.divEle.style.display = 'none'
        }
        // 生成dom
        createHtml(){
            let divEle = document.createElement('div');
            divEle.classList.add('container');
            divEle.style.display = 'none';
            divEle.innerHTML = `<div class="k-wrapper"></div>
            <div class="k-dialog" style='width:${this.opts.width};height:${this.opts.height}'>
                <div class="k-header">
                    <span class="k-title">${this.opts.title}</span><span class="k-close">X</span>
                </div>
                <div class="k-body">
                    <span>${this.opts.content}</span>
                </div>
                <div class="k-footer">
                ${this.opts.isCancel?'<span class="k-default">取消</span>':''}
                    
                    <span class="k-primary">确定</span>
                </div>`;
                this.divEle = divEle;
            document.querySelector('body').appendChild(divEle);

        }
        // 显示对话框
        open(){
            // 控制是否有遮罩
            if(!this.opts.maskable){
                this.divEle.querySelector('.k-wrapper').style.display = 'none';
            }
            this.divEle.style.display = 'block'
            
        }
        // 拖拽
        dragable(){
            let header = this.divEle.querySelector('.k-header');
            let kDialog = this.divEle.querySelector('.k-dialog')
            header.onmousedown = function(e){
                let x = e.clientX - kDialog.offsetLeft;
                let y = e.clientY- kDialog.offsetTop;
                // console.log(x,y)
                header.onmousemove = function(e){
                    let xx = e.clientX;
                    let yy = e.clientY;
                // console.log(xx,yy)
                    // 鼠标的距离 - 鼠标和盒子的距离 = 盒子00点位置
                    kDialog.style.left = xx - x + 'px';
                    kDialog.style.top = yy - y + 'px';
                }
            }
            // 鼠标抬起取消拖拽
            document.onmouseup = function(){
                header.onmousemove = '';
            }
        }
    
}

// 继承扩展功能；
export class DislogExtends extends Dialog{
    constructor(options){
        super(options)
        this.createInput()
        // this.createInput()

    }
    createInput(){
        let input = document.createElement('input');
        input.type = 'text';
        input.classList.add('input-inner');
        this.input = input;
        // console.log(this.input.value)
        this.divEle.querySelector('.k-body').appendChild(input)
    }
    confirm(){
        // 获取值
        let value = this.input.value;
        // console.log('子类的confirm')    覆盖了之前的confirm
        super.confirm(value);    //通过super拿到之前的方法执行
        // 下面扩展自己的方法
        // console.log(value)
    }
}

// 自定义HTML组件
class MyDialog extends HTMLElement{
    constructor(){
        super();
        console.log(this);
        // attributes 获得元素属性的集合
        let attrs = this.attributes;
        let width = attrs['width'].value;
        // 如果存在指定属性，则 hasAttribute() 方法返回 true，否则返回 false
        let height =this.hasAttribute('height')?attrs['height'].value:'250px';
        let title = attrs['title'].value;
        let content = attrs['content'].value;
        this.innerHTML = `<button>点击显示对话框</button>`;
        // console.log(width);
        this.onclick = function(){
            let dialog = new Dialog({
                width,
                height,
                title,
                content
            });
            dialog.open();
        }
        
    }
}

customElements.define("my-dialog",MyDialog);
