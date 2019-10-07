import React from 'react';

import AdaptableImg from '../AdaptableImg';
import Button from '../Button';
import Icon from '../Icon';
import { updown } from '../../assets/images';

const Card = (props) => {
    const { item } = props;

    return (
        <div className="card">
            <div className="card-content">
                <div className="media">
                    <div className="media-left">
                        <figure className="image is-96x96">
                            <AdaptableImg src={item.companylogo} />
                        </figure>
                    </div>

                    <div className="media-content">
                        <p className="title is-5">{item.name}</p>
                        <p
                            className="subtitle is-7"
                            style={{ maxHeight: "5vh", overflow: "hidden" }}
                        >
                            {item.description}
                        </p>
                    </div>

                    <div className="media-right">
                        <ul>
                            <li>
                                <Button
                                    text={<Icon name="chart-line fa-1x" />}
                                    className="is-primary"
                                    style={{ marginBottom: 5, width: "5vh" }}
                                />
                            </li>
                            <li>
                                <Button
                                    text={<Icon name="fas fa-shopping-bag fa-1x" />}
                                    className="is-primary"
                                    style={{ marginBottom: 5, width: "5vh" }}
                                />
                            </li>
                            <li>
                                <Button
                                    text={<Icon name="fas fa-newspaper fa-1x" />}
                                    className="is-primary"
                                    style={{ marginBottom: 5, width: "5vh" }}
                                />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <footer
                style={{
                    display: "flex",
                    position: "absolute",
                    bottom: "2vh",
                    left: "32%",
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <p style={{ marginRight: 12, textAlign: 'center', alignSelf: 'center' }}>{item.currency} {item.price}</p>
                <p style={{ textAlign: 'center', alignSelf: 'center' }}><img src={updown} style={{ height: 20, width: 20 }} /> {item.change}</p>
            </footer>
        </div>
    )
}

export default Card;

