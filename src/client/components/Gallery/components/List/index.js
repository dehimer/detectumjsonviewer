import React from "react";

export default ({ json, select }) => {
  if (!json) return null;

  const { es_response } = json;
  if (!es_response) return null;

  const { hits } = es_response;
  if (!hits) return null;

  const { hits: items } = hits;
  if (!items) return null;

  return items.map(hit => {
    const { _source } = hit;
    const { id, img_url, model } = _source;

    return (
      <div
        className='item' key={id}
        onClick={() => select(id)}
      >
        <img src={img_url}/>
        <div>{model}</div>
      </div>
    );
  });
}
