import React from 'react';

import AdaptableImg from '../AdaptableImg';
import Button from '../Button';
import Icon from '../Icon';
import { updown } from '../../assets/images';

const Card = (props) => {
    const { item } = props;

    if (props.screen) {
        return (
            <div className="_card" style={{ width: '28%', height: '28%' }}>
                <div
                    className="left"
                >
                    <AdaptableImg src={item.companylogo} />

                </div>
                <div
                    className="center"
                >
                    <h2>{item.companyname}</h2>
                    <h4>{item.name}</h4>
                    <h3
                    // className={`${item.change > 0 ? 'has-text-success' : 'has-text-danger'}`}
                    >{item.price} {item.currency}</h3>
                    {/* <p
                >{item.description.slice(0, 64)}</p> */}
                    {/* <div> */}
                    {/* <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        background: 'red',
                        alignSelf: 'stretch'
                    }}
                > */}
                    <Icon
                        className={`fa-2x${item.changePercent > 0 ? ' has-text-success' : item.changePercent == 0 ? ' has-text-primary' : ' has-text-danger'}`}
                        name={item.changePercent > 0 ? 'arrow-circle-up' : item.changePercent == 0 ? 'minus-circle' : 'arrow-circle-down'}
                    />
                    <p className={`value${item.changePercent > 0 ? ' has-text-success' : item.changePercent == 0 ? ' has-text-primary' : ' has-text-danger'}`}>{item.changePercent} % </p>
                    {/* </div> */}
                    {/* </div> */}
                </div>
                <span>{item.timestamp}</span>
            </div>
        )
    } else {
        return (
            <div className="_card">
                <div
                    className="left"
                >
                    <AdaptableImg src={item.companylogo} />

                </div>
                <div
                    className="center"
                >
                    <h2>{item.name}</h2>
                    <h3
                    // className={`${item.change > 0 ? 'has-text-success' : 'has-text-danger'}`}
                    >{item.price} {item.currency}</h3>
                    {/* <p
                >{item.description.slice(0, 64)}</p> */}
                    {/* <div> */}
                    {/* <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        background: 'red',
                        alignSelf: 'stretch'
                    }}
                > */}
                    <Icon
                         className={`fa-2x${item.changePercent > 0 ? ' has-text-success' : item.changePercent == 0 ? ' has-text-primary' : ' has-text-danger'}`}
                         name={item.changePercent > 0 ? 'arrow-circle-up' : item.changePercent == 0 ? 'minus-circle' : 'arrow-circle-down'}
                     />
                     <p className={`value${item.changePercent > 0 ? ' has-text-success' : item.changePercent == 0 ? ' has-text-primary' : ' has-text-danger'}`}>{item.changePercent} % </p>
                    {/* </div> */}
                    {/* </div> */}
                </div>
                <div className="right">
                    <Button
                        title="gráfico"
                        text={<Icon name="chart-line fa-1x" />}
                        className="is-primary is-medium"
                        style={{ marginBottom: 5, width: 30, height: 30 }}
                    />
                    <Button
                        title="compra"
                        text={<Icon name="fas fa-shopping-bag fa-1x" />}
                        className="is-primary is-medium"
                        onClick={props.onBuy}
                        style={{ marginBottom: 5, width: 30, height: 30 }}
                    />
                    <Button
                        title="noticias"
                        text={<Icon name="fas fa-newspaper fa-1x" />}
                        className="is-primary is-medium"
                        onClick={() => { props.showModal(); props.getNews(props.stockUUID) }}
                        style={{ marginBottom: 5, width: 30, height: 30 }}
                    />
                </div>
                <span>{item.timestamp}</span>
            </div>
        )
    }
    // <div className="card">
    //     <div className="card-content">
    //         <div className="media">
    //             <div className="media-left">
    //                 <figure className="image is-96x96">
    //                     <AdaptableImg src={item.companylogo} />
    //                 </figure>
    //             </div>

    //             <div className="media-content">
    //                 <p className="title is-5">{item.name}</p>
    //                 <p
    //                     className="subtitle is-7"
    //                     style={{ maxHeight: "5vh", overflow: "hidden" }}
    //                 >
    //                     {item.description}
    //                 </p>
    //             </div>

    //             <div className="media-right">
    //                 <ul>
    //                     <li>
    //                         <Button
    //                             text={<Icon name="chart-line fa-1x" />}
    //                             className="is-primary"
    //                             style={{ marginBottom: 5 }}
    //                         />
    //                     </li>
    //                     <li>
    //                         <Button
    //                             text={<Icon name="fas fa-shopping-bag fa-1x" />}
    //                             className="is-primary"
    //                             style={{ marginBottom: 5, width: "2.5rem" }}
    //                         />
    //                     </li>
    //                     <li>
    //                         <Button
    //                             text={<Icon name="fas fa-newspaper fa-1x" />}
    //                             className="is-primary"
    //                             style={{ marginBottom: 5, width: "2.5rem" }}
    //                         />
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </div>


    // </div>
}

export default Card;

