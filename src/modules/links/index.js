
/**
 * 友情链接
 */

import React from 'react';

import { links } from '../../../config';
import './index.scss';

export default class Links extends React.PureComponent {

  render() {

    if (!links || !links.length) return null;

    return(
      <div className="card">
        <div className="card-header">友情链接</div>
        <div className="card-body" styleName="body">
          {links.map((item, index)=>{
            return (<a key={index} href={item.domain} target="_blank">
              <b>{item.name}</b><br />{item.description}
            </a>)
          })}
        </div>
      </div>
    )
  }

}
