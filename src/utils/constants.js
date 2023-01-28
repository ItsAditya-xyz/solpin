//if you think this shuld be in .env file, you don't know what you are doing LMAOO
// Pls don't fuck up with that URL, just pls don't
export const protocolOptions = {
  useIndexer: true,
  rpcUrl:
    "https://rpc.helius.xyz/?api-key=b228ed66-73d6-4441-b7be-08ff999b346f", 
};


export  const LinkifyOptions = {
  formatHref: {
    url: (value) => {
      return value;
    },
  },
  render: {
    url: ({ attributes, content }) => {
      return (
        <a {...attributes} className='text-purple-500 hover:text-purple-600 underline' target='_blank'>
          {content}
        </a>
      );
    }
  }
};