import React, { PureComponent, Fragment } from 'react';

import Block from '../Block';

import styles from './index.css'

export default class Explanation extends PureComponent {

  eatDescription = ({description='', jsoned}, params) => {
    // console.log('eatDescription');
    // console.log(description);
    const dotsIndex = description.lastIndexOf(':');
    if (description && dotsIndex !== -1) {
      let value;
      const foundCurlesIds = [description.lastIndexOf('{'), description.lastIndexOf('}')];
      // console.log('foundCurlesIds');
      // console.log(foundCurlesIds);

      let commed = false;
      let commaIndex;
      let leftDescription;

      if (foundCurlesIds[0] !== -1 && foundCurlesIds[1] !== -1 && (description.length-1) === foundCurlesIds[1]) {
        commed = true;
        // console.log('commed');
        // console.log(commed);
        // console.log(description[foundCurlesIds[0]]);
        // console.log(description[foundCurlesIds[1]]);
        value = description.substring(foundCurlesIds[0]+1, foundCurlesIds[1]);
        // console.log('value');
        // console.log(value);

        leftDescription = description.substring(0, foundCurlesIds[0]+1);
        // console.log('leftDescription1');
        // console.log(leftDescription);
        leftDescription = leftDescription.substring(0, leftDescription.lastIndexOf(':')).trim();
        // console.log('leftDescription2');
        // console.log(leftDescription);

        commaIndex = leftDescription.lastIndexOf(',');
      } else {
        value = description.substring(dotsIndex+1, description.length+1).trim();

        leftDescription = description.substring(0, dotsIndex);
        commaIndex = leftDescription.lastIndexOf(',');
      }

      // console.log('value');
      // console.log(value);

      // console.log('leftDescription');
      // console.log(leftDescription);

      if (commaIndex !== -1) {
        const param = leftDescription.substring(commaIndex+1, leftDescription.length).trim();
        // console.log('param');
        // console.log(param);
        params.unshift([param, value, jsoned, commed]);
        this.eatDescription({description: leftDescription.substring(0, commaIndex), jsoned}, params);
      } else {
        // console.log('leftDescription');
        // console.log(leftDescription);
        params.unshift([leftDescription, value, jsoned, commed]);
      }
    }

    return params;
  };

  render() {
    const { explanation } = this.props;
    const { details=[] } = explanation;

    let { description } = explanation;

    const jsoned = description[0] === '{' && description[description.length-1] === '}';
    if (jsoned) {
      description = description.substring(1, description.length-1);
    }

    // console.log(description);
    const params = this.eatDescription({ description, jsoned }, []);
    console.log('params are');
    console.log(params);

    const blockContent = params.map(([param, value, jsoned, commed], idx) => {
      if (commed) {
        return <Fragment key={param+idx+'_param_commed'} >
          <Block uncollapsable={true}>
            <span className={styles.param}>{param}: </span>
            {
              this.eatDescription({ description: value, jsoned }, []).map(([param, value], i, arr) => (
                <span key={i+param}>
                  <span className={styles.subParam}>{param}:</span>
                  <span>{value}</span>
                  { arr.length !== i+1 && <span>, </span> }
                </span>
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
