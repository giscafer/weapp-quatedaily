import Taro, { Component } from '@tarojs/taro';
import { View, Button, Text, Image } from '@tarojs/components';
import { observer, inject } from '@tarojs/mobx';
import { AtActivityIndicator, AtButton } from 'taro-ui';
import { toJS } from 'mobx';
import dayjs from 'dayjs';
import { copy } from '../../utils/clipboard';

import './index.scss';

import downloadIcon from '../../assets/images/download.png';
import callenderIcon from '../../assets/images/callender.png';
import copyIcon from '../../assets/images/copy.png';
import shareIcon from '../../assets/images/share.png';
import { images2Canvas } from '../../services/puzzles.services';

@inject(stores => ({
  data: stores.quoteDailyStore.data,
  loadData: stores.quoteDailyStore.loadData,
  getToken: stores.quoteDailyStore.getToken,
  getQrCode: stores.quoteDailyStore.getQrCode
}))
@observer
class Index extends Component {
  config = {
    navigationBarTitleText: '每日一句'
    // enablePullDownRefresh: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 414,
      windowHeight: 736,
      page: 0,
      loading: false
    };
  }

  componentWillMount() {
    this.setState({
      page: this.$router.params.page || 0
    });
  }

  componentDidMount() {
    this.query();
    Taro.getSystemInfo({
      success: res => {
        console.log(res);
        this.setState({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight
        });
      }
    });
  }

  componentWillUnmount() {}

  componentDidShow() {}

  /*   onPullDownRefresh() {
      if (this.state.page === 0) return;
      this.setState({
        loading: true,
        page: this.state.page - 1,
      }, () => {
        this.query();
      });
    } */

  /* onReachBottom() {
    this.setState({
      loading: true,
      page: 1 + this.state.page,
    }, () => {
      this.query();
    })
  } */

  query() {
    const { loadData } = this.props;
    loadData(this.state.page).then(res => {
      // Taro.stopPullDownRefresh();
      if (res) {
        this.setState({
          loading: false
        });
        this.forceUpdate();
        /*  setTimeout(() => {
           Taro.pageScrollTo({
             scrollTop: 0,
             duration: 100
           });
         }, 150); */
        return;
      }
      this.setState({
        page: this.state.page - 1,
        loading: false
      });
    });
  }

  render() {
    const { data } = this.props;
    const info = toJS(data);
    const {
      content = '',
      translation = '',
      author = '',
      assign_date = '',
      origin_img_urls = []
    } = info;
    let styleStr = `width: 100%;height: ${this.state.windowHeight}px`;
    let imgUrl =
      'https://media-image1.baydn.com/soup_pub_image/ccdbwr/a11603cca6ec4176814eba358fbdb9c2.c0c1b155d411923d811db77fa418808c.png';
    if (origin_img_urls[0]) {
      imgUrl = origin_img_urls[0].replace('@!fhd_webp', '');
    }
    let day = '';
    let year = '';
    let month = '';
    if (assign_date) {
      let date = dayjs(assign_date);
      day = date.date();
      month = date.format('MMM');
      year = date.year();
    }

    return (
      <View className='index'>
        <Image src={imgUrl} className='bg' style={styleStr} />
        <View className='bg-modal' style={styleStr}>
          {' '}
        </View>
        <View className='main'>
          <View className='quote'>
            <View className='date-show'>
              <Text className='day'>{day}</Text>
              <Text className='month'>{month}.</Text>
              <Text className='year'>{year}</Text>
            </View>
            <Text className='content'>{content}</Text>
            <Text className='trans'>{translation}</Text>
            <Text className='author'>—— {author}</Text>
          </View>
        </View>
        <Image
          src={downloadIcon}
          className='down'
          onClick={this.downHandler.bind(this, {
            imgUrl,
            content,
            translation,
            author
          })}
        />
        {/* <Button openType='openSetting' className='down' /> */}
        <Image
          src={callenderIcon}
          className='link'
          onClick={this.changeDate.bind(this, {
            content,
            translation,
            author
          })}
        />
        <Image
          src={copyIcon}
          className='copy'
          onClick={this.copyHandler.bind(this, {
            content,
            translation,
            author
          })}
        />
        <Image src={shareIcon} className='share' />
        <Button openType='share' className='share' />
        {this.state.loading && (
          <View className='loading'>
            <AtActivityIndicator content='加载中...' />
          </View>
        )}
        <View className='operate'>
          <AtButton
            onClick={this.preview.bind(this)}
            type='secondary'
            size='small'
            disabled={this.state.page === 0}
          >
            {this.state.page === 0 ? '今天' : '上一句'}
          </AtButton>
          <AtButton
            onClick={this.next.bind(this)}
            type='secondary'
            size='small'
            className='right'
          >
            下一句
          </AtButton>
        </View>
        <View className='share-canvas'>
          <canvas canvas-id='shareCanvas' style='width:527px;height:937px' />
        </View>
      </View>
    );
  }

  preview() {
    let count = this.state.page - 1;
    this.setState(
      {
        loading: true,
        page: count > 0 ? count : 0
      },
      () => {
        this.query();
      }
    );
  }

  next() {
    this.setState(
      {
        loading: true,
        page: 1 + this.state.page
      },
      () => {
        this.query();
      }
    );
  }

  changeDate() {
    this.setState(
      {
        page: 0
      },
      () => {
        this.query();
      }
    );
  }

  downHandler(info) {
    images2Canvas({
      canvasId: 'shareCanvas',
      imgUrls: [
        info.imgUrl,
        'https://ww1.sinaimg.cn/large/940e68eegy1g5hy9qr2vjj20by0bytb3.jpg'
      ],
      puzzlesType: 'single_graph',
      description: info
    });
  }

  copyHandler({ content, translation, author }) {
    let text = `${content}\n${translation}\n ——${author}`;
    copy(text);
  }

  onShareAppMessage() {
    return {
      title: `每日一句-鸡汤老师`,
      path: `/pages/index/index?page=${this.state.page}`
    };
  }
}

export default Index;
