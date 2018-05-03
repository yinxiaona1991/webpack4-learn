var fun = function(var1){
    console.log(val1);
}

fun('hello.');

let a = 23;
let fun2 = () => {
    alert(`${a}`)
}

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}