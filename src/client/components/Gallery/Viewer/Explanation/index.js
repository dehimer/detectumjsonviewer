import React, { PureComponent } from 'react';

import Block from '../Block';

export default class Explanation extends PureComponent {
  render() {
    const { explanation } = this.props;
    const { details=[] } = explanation;

    let { description } = explanation;
    console.log('description');
    console.log(description);
    const params = [];

    if (description[0] === '{' && description[description.length-1] === '}') {
      description = description.slice(1, description.length-1);
    }
    console.log('description -{}');
    console.log(description);

    const eatDescription = (description) => {
      console.log(`eatDescription: ${description}`);
      const dotsIndex = description.lastIndexOf(':');
      console.log(`dotsIndex: ${dotsIndex}`);
      if (description && dotsIndex !== -1) {
        const value = description.slice(dotsIndex+1, description.length).trim();
        console.log(`value: ${value}`);

        const leftDescription = description.slice(0, dotsIndex-1);
        console.log(`leftDescription: ${leftDescription}`);

        const commaIndex = leftDescription.lastIndexOf(',');
        console.log(`commaIndex: ${commaIndex}`);
        if (commaIndex !== -1) {
          const param = leftDescription.slice(commaIndex+1, leftDescription.length);
          params.push([param.trim(), value]);
          eatDescription(leftDescription.slice(0, commaIndex));
        } else {
          params.push([leftDescription, value]);
        }
      }
    };

    eatDescription(description);

    console.log('params');
    console.log(params);

    return (
      <>
        <Block>
          {
            params.map(([param, value]) => (
              <div key={param}>{param}: {value}</div>
            ))
          }
        </Block>
        {
          details.map(explanation => {
            const { description } = explanation;

            return (
              <Explanation key={description} explanation={explanation}/>
            )
          })
        }
      </>
    )
  }
}
