# PlotBot

PlotBot is a ghostwriting program designed to assist users in generating creative and engaging written content. With the help of OpenAI's powerful language model, PlotBot generates compelling plotlines, stories, and narratives to inspire writers and provide a starting point for their creative endeavors.

## Installation

To install PlotBot, please follow these steps:

Clone the PlotBot repository to your local machine:

Copy code

```bash
git clone https://github.com/henrbren/plotbot.git
```

Navigate to the project directory:

```bash
cd plotbot
```

Install the required dependencies using npm:

```bash
npm install
```

### Environment Variables

Rename the .env.example file to .env:

```bash
mv .env.example .env
```

To run this project, you will need to add the following environment variables to your .env file

`OPENAI_API_KEY`

Open the .env file and modify the value of OPENAI_API_KEY to your OpenAI API key. If you don't have an API key, you can obtain one from the OpenAI website.

### Usage

Once you have installed PlotBot and configured your OpenAI API key, you can start using the program. To run PlotBot server, execute the following command:

```bash
npm start
```

To open PlotBot in your web browser, execute the following command:

```bash
npm run open
```

PlotBot will prompt you for inputs and generate stories, or narratives based on your interactions.

### Configuration

PlotBot relies on the OpenAI API for its language generation capabilities. The API key is required to access the OpenAI services. To configure your OpenAI API key, follow these steps:

Visit the OpenAI website and sign in to your account (or create a new account if you don't have one).

Navigate to the API settings page and generate an API key.

Copy the generated API key.

Open the .env file in your PlotBot project directory.

Replace the placeholder value for OPENAI_API_KEY with your actual API key.

Save the .env file.

### Contributing

Contributions to PlotBot are welcome! If you encounter any issues, have suggestions for improvements, or would like to add new features, please feel free to submit a pull request. We appreciate your contributions.

Before contributing, please review the contribution guidelines.

### License

PlotBot is licensed under the MIT License.

### Disclaimer

PlotBot is an experimental project and should be used for creative inspiration and exploration purposes only. The generated content may not always be accurate, coherent, or suitable for all purposes. Use the program responsibly and review and edit the output as necessary. The creators and maintainers of PlotBot disclaim all liability for any consequences resulting from the use of this program.
