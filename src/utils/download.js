import Taro from '@tarojs/taro';
import { showToast } from './messegeUtil';
import { downloadFiles } from '../services/puzzles.services';

/**
 * 下载图
 */
export default function downloadPic(img) {
  let imgUrls = [img];
  Taro.getSetting().then(res => {
    if (res.authSetting && !res.authSetting['scope.writePhotosAlbum']) {
      showToast('您未允许授权保存到相册，请前往设置', 3000);
      return;
    }
    downloadFiles({
      imgUrls
    });
  })
}
