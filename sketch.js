
function setup() {

    var newPersonRatingsExample  = {
        "Lady in the Water": 3.0,
        "Snakes on a Plane": 3.5,
        "Just My Luck": 1.5,
        "Superman Returns": 5.0,
        "The Night Listener": 3.0,
        "You, Me and Dupree": 3.5
    }

    var similarityScores = KNN(5, newPersonRatingsExample, data.ratings);
    console.log(similarityScores);
    var moviePredictions = PredictMovieRatings(similarityScores, data.ratings, data.movies)
    console.log(moviePredictions);
}

function KNN(k, newRatings, trainingRatings) {
    
    var ratingsByPerson = trainingRatings;
    var movies = data.movies;
    var similarityScores = [];

    for (const person in ratingsByPerson) {
        var sumSquares = 0;
        for (const m in movies) {
            var movie = movies[m];
            if (ratingsByPerson[person].hasOwnProperty(movie)) {
                sumSquares += Math.pow(newRatings[movie] - ratingsByPerson[person][movie], 2);
            }
        }

        similarityScores.push({
            person: person, 
            similarity: 1 / (1 +  Math.sqrt(sumSquares))
        });
    }

    similarityScores.sort(function(a,b){
        return b.similarity - a.similarity
    })
    
    return similarityScores.slice(0, k);
}

function PredictMovieRatings(similarityScores, trainingRatings, movies) {
    // movie rating predictions from k nearest neighbours
    
    var moviePredictions = [];
    
    var similaritySum = 0;
    for (var i = 0; i < similarityScores.length; i++)  {
        var personName = similarityScores[i].person;

        for (const key in movies) {
            var movieTitle = movies[key];

            if(!moviePredictions.hasOwnProperty(movieTitle)) {
                moviePredictions[movieTitle] = 0
            }

            if(trainingRatings[personName].hasOwnProperty(movieTitle)) {
                var rating = trainingRatings[personName][movieTitle];
                var similarity = similarityScores[i].similarity;
                moviePredictions[movieTitle] += rating * similarity;
            }
        }

        similaritySum += similarity;
    }

    for (const key in moviePredictions) {
        moviePredictions[key] /= similaritySum;
    }

    return moviePredictions;
}

function draw() {
    
    ellipse(50, 50, 80, 80);
}