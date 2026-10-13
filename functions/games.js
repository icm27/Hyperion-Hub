export async function onRequest(context) {
  let prefixes = new Set();
  let cursor = undefined;

  do {
    const list = await context.env.GAME_BUCKET.list({ 
      delimiter: '/',
      cursor: cursor 
    });
    
    if (list.delimitedPrefixes) {
      list.delimitedPrefixes.forEach(prefix => prefixes.add(prefix));
    }
    
    cursor = list.truncated ? list.cursor : undefined;
  } while (cursor);

  const games = Array.from(prefixes).map(prefix => {
    const id = prefix.replace(/\/$/, '');
    
    const cleanTitle = id
      .replace(/[-_]/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());

    return {
      id: id,
      title: cleanTitle,
      image: `https://assets.highcountrycoffee.com/${id}/thumbnail.png`
    };
  });

  return new Response(JSON.stringify(games), {
    headers: { 
        "Content-Type": "application/json",
        "Cache-Control": "max-age=3600"
    }
  });
}