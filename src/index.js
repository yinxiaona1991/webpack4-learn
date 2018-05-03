console.log('hello webpack4 .')

import '../resources/css/style.css';   // 引入css
import '../resources/less/style.less'; // 引入less

if (module.hot) {
    // 实现热更新
    module.hot.accept();
}