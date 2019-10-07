import React from 'react'

class AdaptableImg extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tall: false
    }
  }
  _onLoadImage({ target }) {
    this.setState({
      tall: target.naturalWidth / target.naturalHeight > 1 ? false : true
    })
  }
  render() {

    return <img
      className={`_adaptable_img ${this.state.tall ? 'tall' : 'wide'}`}
      onLoad={this._onLoadImage.bind(this)}
      src={this.props.src}
    />
  }
}

export default AdaptableImg
