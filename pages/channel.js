import "isomorphic-fetch";
import Error from './_error';
import Layout from '../components/layout'
import ChannelGrid from '../components/channel-grid'
import PodcastListWithClick from '../components/podcast-list-with-click'
import PodcastPlayer from '../components/podcast-player';

export default class extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      openPodcast: null,
    }
  }

  static async getInitialProps({ query, res }) {
    try {
      let idChannel = query.id;
  
      let [reqChannel, reqAudios, reqSeries] = await Promise.all([
        fetch(`https://api.audioboom.com/channels/${idChannel}`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/audio_clips`),
        fetch(`https://api.audioboom.com/channels/${idChannel}/child_channels`)
      ])

      if(reqChannel.status >= 400) {
        res.statusCode = reqChannel.status;
        return { channel: null, audioClips: null, series: null, statusCode: reqChannel.status }
      }
  
      let [dataChannel, dataAudios, dataSeries] = await Promise.all([
        reqChannel.json(),
        reqAudios.json(),
        reqSeries.json()
      ])
  
      let channel = dataChannel.body.channel;
      let audioClips = dataAudios.body.audio_clips;
      let series = dataSeries.body.channels;
  
      return { channel, audioClips, series, statusCode: 200 };
    } catch (e) {
      return { channel: null, audioClips: null, series: null, statusCode: 503 }
    }
  }

  openPodcast = (event, podcast) => {
    event.preventDefault();
    this.setState({
      openPodcast: podcast,
    })
  }

  closePodcast = (event) => {
    event.preventDefault();
    this.setState({
      openPodcast: null
    })
  }

  render() {
    const { channel, audioClips, series, statusCode } = this.props
    const { openPodcast, close } = this.state;

    if (statusCode !== 200) {
      return <Error statusCode={ statusCode }/>
    }

    return (
      <Layout title={channel.title}>
        <div className="banner" style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }} />

        { openPodcast && 
          <div className="modal">
            <PodcastPlayer 
              clip={openPodcast}
              onClose={closePodcast}
            />
          </div>
        }
        
        <h2>{ channel.title }</h2>

        { series.length > 0 &&
          <div>
            <h3>Series</h3>
            <ChannelGrid channels={ series } />
          </div>
        }

        <h3>Últimos Podcasts</h3>
        <PodcastListWithClick 
          podcasts={ audioClips }
          onClickPodcast={openPodcast}
        />

        <style jsx>{`
          .banner {
            width: 100%;
            padding-bottom: 25%;
            background-position: 50% 50%;
            background-size: cover;
            background-color: #aaa;
          }
          h2 {
            font-weight: 600;
            padding: 15px;
          }
          h3 {
            padding: 15px;
            font-size: 1.2em;
            font-weight: 600;
            margin: 0;
          }
          .modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 99999;
          }
        `}</style>
      </Layout>
    )
  }
}
