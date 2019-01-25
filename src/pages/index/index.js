import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { observer, inject } from '@tarojs/mobx'

import './index.scss'


@inject(stores => ({
  data: stores.quoteDailyStore.data,
  loadData: stores.quoteDailyStore.loadData,
}))
@observer
class Index extends Component {

  config = {
    navigationBarTitleText: '每日一句'
  }

  componentWillMount() { }


  componentDidMount() {
    const { loadData } = this.props;
    loadData().then(() => {
      this.forceUpdate();
    })
  }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }


  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <View className='index'>
        <Button onClick={this.increment}>+</Button>
        <Button onClick={this.decrement}>-</Button>
        <Button onClick={this.incrementAsync}>Add Async</Button>
        <Text>{data}</Text>
      </View>
    )
  }
}

export default Index
