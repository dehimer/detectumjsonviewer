import React, { PureComponent, Fragment } from 'react';

import Block from '../Block';

export default class Explanation extends PureComponent {
  render() {
    const { explanation } = this.props;
    const { details=[] } = explanation;

    let { description } = explanation;
    console.log('description');
    console.log(description);
    const params = [];

    const jsoned = description[0] === '{' && description[description.length-1] === '}';
    if (jsoned) {
      description = description.substr(1, description.length-2);
      console.log('JSONED');
      console.log(description);
    }

    const eatDescription = (description) => {
      console.log('eatDescription');
      console.log(description);
      const dotsIndex = description.lastIndexOf(':');
      if (description && dotsIndex !== -1) {
        let value;
        const foundCurlesIds = [description.lastIndexOf('{'), description.lastIndexOf('}')];
        console.log('foundCurlesIds');
        console.log(foundCurlesIds);

        let commed = false;
        let commaIndex;
        let leftDescription;

        if (foundCurlesIds[0] !== -1 && foundCurlesIds[1] !== -1 && (description.length-1) === foundCurlesIds[1]) {
          commed = true;
          console.log('commed');
          console.log(commed);
          value = description.substr(foundCurlesIds[0]+1, foundCurlesIds[1]-3);

          leftDescription = description.substr(0, foundCurlesIds[0]);
          leftDescription = leftDescription.substr(0, leftDescription.lastIndexOf(':')-1).trim();

          commaIndex = leftDescription.lastIndexOf(',');
        } else {
          value = description.substr(dotsIndex+1, description.length).trim();

          leftDescription = description.substr(0, dotsIndex);
          commaIndex = leftDescription.lastIndexOf(',');
        }

        console.log('value');
        console.log(value);

        console.log('leftDescription');
        console.log(leftDescription);

        if (commaIndex !== -1) {
          const param = leftDescription.substr(commaIndex+1, leftDescription.length).trim();
          console.log('param');
          console.log(param);
          params.unshift([param, value, jsoned, commed]);
          eatDescription(leftDescription.substr(0, commaIndex));
        } else {
          console.log('leftDescription');
          console.log(leftDescription);
          params.unshift([leftDescription, value, jsoned, commed]);
        }

      }
    };

    eatDescription(description);
    console.log('params');
    console.log(params);

    const blockContent = params.map(([param, value, jsoned, commed], idx) => {
      if (commed) {
        return <Fragment key={param+idx+'_param_commed'} >
          <Block uncollapsable={true}>
            {param}
          </Block>
          <Block>
            {
              value.split(',').map((v, i) => (
                <div key={param+idx+'_value_commed_'+i}>
                  {v.trim()}
                </div>
              ))
            }
          </Block>
        </Fragment>
      } else if (jsoned) {
        return <Block key={param+'_jsoned_'+idx} uncollapsable={true}>
          {param}: {value}
        </Block>
      } else {
        return <div key={idx+param}>{param}: {value}</div>
      }
    });

    return (
      <>
        {
          blockContent.length
            ? jsoned
              ? <div>{blockContent}</div>
              : <Block uncollapsable={blockContent.length <= 2}>{blockContent}</Block>
            : null
        }
        {
          details.map((explanation, idx) => {
            const { description } = explanation;
            return (
              <Explanation key={description+'_explanation_'+idx} explanation={explanation}/>
            )
          })
        }
      </>
    )
  }
}
