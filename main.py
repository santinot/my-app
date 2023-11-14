from flask import Flask, request, jsonify
import pandas
import emoji
import nltk
import googletrans
from googletrans import Translator
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# GLOBAL VAR.
SOURCE_LANGUAGE = "it"
DESTINATION_LANGUAGE = "en"
COMPOUND_THRESH = 0.25
POSITIVE = 1
NEGATIVE = -1
NEUTRAL = 0

# Funzione che traduce un testo da italiano a inglese per sentiment analysis,
# i modelli di nltk sono addestrati in inglese
def translate_italian_to_english(text):
    translation = translator.translate(text, src=SOURCE_LANGUAGE, dest=DESTINATION_LANGUAGE)
    return translation.text


# Funzione che rimuove emoji dal testo per il pre-processing
def giveEmojiFreeText(text):
    return emoji.replace_emoji(text, replace='')


# Funzione che pre-processa il testo prima della sentiment
def preProcessText(text):
    # Tokenize the text
    tokens = word_tokenize(text.lower())

    # Remove stop words
    filtered_tokens = [token for token in tokens if token not in stopwords.words('italian')]

    # Lemmatize the tokens
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(token) for token in filtered_tokens]

    # Join the tokens back into a string
    processed_text = ' '.join(lemmatized_tokens)

    # Ritorna il testo processato
    return processed_text


# create get_sentiment function
# 1 -> Sentimento Positivo, 0 -> Sentimento Neutro, -1 -> Sentimento Negativo
def get_sentiment(text):
    scores = analyzer.polarity_scores(text)
    val = scores["compound"]
    if val >= COMPOUND_THRESH:
        return POSITIVE
    elif val <= -COMPOUND_THRESH:
        return NEGATIVE
    else:
        return NEUTRAL
    return val


# Funzione che esegue la sentiment analysis in diversi step
# - rimozione emoji -> traduzione in inglese -> pre-processing -> sentiment score
def sentimentAnalysis(msg):
    # Filtraggio emoji
    msg_without_emoji = giveEmojiFreeText(msg)

    # Messaggio tradotto in inglese
    msg_translated = translate_italian_to_english(msg_without_emoji)

    # Messaggio processato
    msg_processed = preProcessText(msg_translated)

    # Sentiment Analysis
    score = get_sentiment(msg_processed)
    return score

app = Flask(__name__)

@app.route('/api/get/<data>', methods=['GET'])
def get(data):
    return jsonify(data)    


@app.route('/api/post', methods=['POST'])
def post():
    data = request.get_json()
    response = sentimentAnalysis(data["message"])
    return jsonify({"value" : str(response)})


if __name__ == '__main__':
    # initialize NLTK sentiment analyzer
    analyzer = SentimentIntensityAnalyzer()
    translator = Translator()

    app.run(debug=True)

    #score = sentimentAnalysis("Ciao, grazie davvero sei indispensabile! oggi che fai?👽🤢")
    #print(score)

