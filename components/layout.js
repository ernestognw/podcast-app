import Link from 'next/link'
import Head from 'next/head'

export default class Layout extends React.Component {
  render() {
    const { children, title } = this.props

    return (
      <div>
        <Head>
          <title>{ title }</title>
          <meta name="viewport" content="width=device-width"/>
        </Head>

        <header>
          <Link href="/">
            <a>
              <img src="../static/platzi-logo.png" alt="platzi-logo"/>
              <h1>Podcasts</h1>
            </a>
          </Link>
        </header>

        { children }

        <style jsx>{`
          header {
            color: #fff;
            background: #8756ca;
            padding: 15px;
            text-align: center;
          }
          header a {
            color: #fff;
            text-decoration: none;
          }
          img {
            width: 40px;
            display: inline-block;
            margin-right: 10px;
          }
          h1 {
            display: inline-block;
            margin: 10px 0px;
          }
        `}</style>

        <style jsx global>{`
          body {
            margin: 0;
            font-family: system-ui;
            background: white;
          }
        `}</style>
      </div>
    )
  }
}