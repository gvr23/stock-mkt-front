import React from 'react';

import AdaptableImg from '../AdaptableImg';
import Button from '../Button';
import Icon from '../Icon';
import { updown } from '../../assets/images';

const Card = (props) => {
    const { item } = props;

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
                    className={`fa-2x${item.changePercent === 0 ? ' has-text-primary' : item.changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}
                    name={item.changePercent === 0 ? 'minus-circle' : item.changePercent > 0 ? 'arrow-circle-up' : 'arrow-circle-down'}
                />
                <p className={`value${item.changePercent === 0 ? ' has-text-primary' : item.changePercent > 0 ? ' has-text-success' : ' has-text-danger'}`}>{item.changePercent} % </p>
                {/* </div> */}
                {/* </div> */}
            </div>
            <div
                className="right"
            >
                <Button
                    text={<Icon name="chart-line fa-1x" />}
                    className="is-primary is-medium"
                    style={{ marginBottom: 5, width: 30, height: 30 }}
                />
                <Button
                    text={<Icon name="fas fa-shopping-bag fa-1x" />}
                    className="is-primary is-medium"
                    onClick={props.onBuy}
                    style={{ marginBottom: 5, width: 30, height: 30 }}
                />
                <Button
                    text={<Icon name="fas fa-newspaper fa-1x" />}
                    className="is-primary is-medium"
                    style={{ marginBottom: 5, width: 30, height: 30 }}
                />
            </div>
            <span>{item.timestamp}</span>
        </div >
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
    )
}

export default Card;

