import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>VOID PANEL | SYSTEM MASTER</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      </Head>

      <Component {...pageProps} />

      {/* Global CSS Reset & Autofill Fix */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          font-family: 'Inter', sans-serif;
        }

        body {
          background-color: #050505;
          color: #ffffff;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* Modern Sleek Scrollbar */
        ::-webkit-scrollbar {
          width: 5px;
        }
        ::-webkit-scrollbar-track {
          background: #000;
        }
        ::-webkit-scrollbar-thumb {
          background: #222;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #333;
        }

        /* The Ultimate Autofill Fix - Prevents White/Yellow Inputs */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0px 1000px #000 inset !important;
          -webkit-text-fill-color: white !important;
          transition: background-color 5000s ease-in-out 0s;
        }

        /* Remove Safari Default Input Styling */
        input, select, button {
          -webkit-appearance: none;
          outline: none;
        }

        /* Tab Transition Animation */
        .fade-enter { opacity: 0; }
        .fade-enter-active { opacity: 1; transition: opacity 300ms; }
      `}</style>
    </>
  );
}

export default MyApp;
