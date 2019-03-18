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
      console.log('description -{}');
      console.log(description);
    }

    const eatDescription = (description) => {
      const dotsIndex = description.lastIndexOf(':');
      if (description && dotsIndex !== -1) {
        const value = description.slice(dotsIndex+1, description.length).trim();

        const leftDescription = description.slice(0, dotsIndex-1);

        const commaIndex = leftDescription.lastIndexOf(',');
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

    return (
      <>
        <Block>
          {
            params.map(([param, value], idx) => (
              <div key={idx+param}>{param}: {value}</div>
            ))
          }
        </Block>
        {
          details.map((explanation, idx) => {
            const { description } = explanation;

            return (
              <Explanation key={idx+description} explanation={explanation}/>
            )
          })
        }
      </>
    )
  }
}
