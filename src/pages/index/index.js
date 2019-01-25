import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text, Image } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'
import { AtActivityIndicator } from 'taro-ui';
import { toJS } from 'mobx';
import dayjs from 'dayjs';
import { copy } from '../../utils/clipboard';

import './index.scss'

import callenderIcon from '../../assets/images/callender.png';
import copyIcon from '../../assets/images/copy.png';
import shareIcon from '../../assets/images/share.png';



@inject(stores => ({
  data: stores.quoteDailyStore.data,
  loadData: stores.quoteDailyStore.loadData,
}))
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '每日一句'
  }

  constructor(props) {
    super(props);
    this.state = {
      windowWidth: 414,
      windowHeight: 736,
      page: 0,
      loading: false,
    }
  }

  componentWillMount() { }


  componentDidMount() {

    this.query();
    Taro.getSystemInfo({
      success: (res) => {
        console.log(res);
        this.setState({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      }
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }


  onReachBottom() {
    this.setState({
      loading: true,
      page: 1 + this.state.page,
    }, () => {
      this.query();
    })
  }

  query() {
    const { loadData } = this.props;
    loadData(this.state.page).then((res) => {
      Taro.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
      if (res) {
        this.setState({
          loading: false
        });
        this.forceUpdate();
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
    const { content = '', translation = '', author = '', assign_date = '', origin_img_urls = [] } = info;
    let styleStr = `width: 100%;height: ${this.state.windowHeight}px`;
    let imgUrl = 'https://media-image1.baydn.com/soup_pub_image/ccdbwr/a11603cca6ec4176814eba358fbdb9c2.c0c1b155d411923d811db77fa418808c.png';
    if (origin_img_urls[0]) {
      imgUrl = origin_img_urls[0].replace('@!fhd_webp', '');
    }

    let date = dayjs(assign_date);
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getYear();

    return (
      <View className='index'>
        <Image src={imgUrl} className='bg' style={styleStr}></Image>
        <View className='bg-modal' style={styleStr}> </View>
        <View className='date-show'>
          <Text className='day'>{day}</Text>
          <Text className='month'>{month}</Text>
          <Text className='year'>{year}</Text>
        </View>
        <View className='quote'>
          <Text className='content'>{content}</Text>
          <Text className='trans'>{translation}</Text>
          <Text className='author'>—— {author}</Text>
        </View>
        <Image src={callenderIcon} className='link' onClick={this.changeDate.bind(this, { content, translation, author })}></Image>
        <Image src={copyIcon} className='copy' onClick={this.copyHandler.bind(this, { content, translation, author })}></Image>
        <Image src={shareIcon} className='share'></Image>
        <Button openType='share' className='share'></Button>
        {
          this.state.loading && <View className='loading'>
            <AtActivityIndicator content='加载中...' ></AtActivityIndicator>
          </View>
        }
      </View>
    )
  }

  changeDate() {

  }


  copyHandler({ content, translation, author }) {
    let text = `${content}\n${translation}\n ——${author}`;
    copy(text);
  }
}

export default Index
