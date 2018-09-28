package main

import (
   "fmt"
   "strconv"
   "github.com/gin-contrib/cors"                        // Why do we need this package?
   "github.com/gin-gonic/gin"
   "github.com/jinzhu/gorm"
   "golang.org/x/crypto/bcrypt"
   _ "github.com/jinzhu/gorm/dialects/sqlite"           // If you want to use mysql or any other db, replace this line
)

var db *gorm.DB                                         // declaring the db globally
var err error

type User struct {
   ID uint `json:"userid";gorm:"primary_key"`
   UserName string `json:"username";gorm:"unique"`
   FirstName string `json:"firstname"`
   LastName string `json:"lastname"`
   Password string `json:"password"`
   Admin bool `json:"isadmin";gorm:"default:false"`
   TotalScore uint `json:"totalscore";gorm:"default:0"`
   Scores []Score
}

type Genre struct {
  ID uint `json:"genreid";gorm:"primary_key"`
  GenreName string `json:"genrename"`
  Quizzes []Quiz
}
type Quiz struct {
  ID uint `json:"quizid";gorm:"primary_key"`
  QuizName string `json:"quizname"`
  GenreID uint `json:"genreid"`
  Questions []Question
}
type Question struct {
  ID uint `json:"qid";gorm:"primary_key"`
  Question string `json:"question"`
  QuizID uint `json:"quizid"`
  Options []Option
}
type Option struct {
  ID uint `json:"optid";gorm:"primary_key"`
  QuestionID uint `json:"qid"`
  OptionName string `json:"optname"`
  Correct bool `json:"iscorrect"`
}

type Score struct {
  ID uint `json:"scoreid";gorm:"primary_key"`
  UserID uint `gorm:"foreignkey:UserID"`
  QuizID uint `gorm:"foreignkey:QuizID"`
  GenreID uint `gorm:"foreignkey:GenreID"`
  Score uint `json:"score";gorm:"default:0"`
  UserName string `json:"user_name"`
}

type Leader struct{
  UserName string `json:"user_name"`
  TotalScore uint `json:"total_score"`
}

type Perf struct{
  QuizName string `json:"quiz_name"`
  Score uint `json:"score";gorm:"default:0"`
}

func main() {
   db, err = gorm.Open("sqlite3", "./gorm.db")
   if err != nil {
      fmt.Println(err)
   }
   defer db.Close()
   db.AutoMigrate( &User{},
                   &Option{},
                   &Question{},
                   &Quiz{},
                   &Genre{},
                   &Score{} )
   r := gin.Default()
   r.GET("/user/", GetUsers)
   r.POST("/user/login",Login)
   r.POST("/user/",Register)

   r.GET("/genres/", GetGenres)
   r.POST("/genre/", CreateGenre)
   r.POST("/genre/:genrename",CreateQuiz)

   r.POST("/question/:quizname",CreateQuestion)
   r.POST("/option/:question",CreateOption)

   r.GET("/quizzes/:genrename",GetQuizzes)
   r.GET("/quiz/:quizname",GetQuiz)
   r.POST("/quiz/",CreateQuiz)
   // r.PUT("/people/:id", UpdatePerson)
   r.DELETE("/user/:id", DeleteUser)
   r.DELETE("/genre/:genrename",DeleteGenre)
   r.DELETE("/quiz/:quizname",DeleteQuiz)

   r.GET("/leader",easyLeaderBoard)
   r.GET("/leader/:genrename",LeaderBoard)
   r.GET("/performance/:userid",Performance)


   r.POST("/score/:quizname/:userid/:score",SetScore)

   r.Use((cors.Default()))
   r.Run(":8080")                                           // Run on port 8080
}

func Performance(c *gin.Context){
 var perfs []Perf
 userid := c.Params.ByName("userid")
 db.Raw("SELECT quiz_name,score from quizzes JOIN scores ON quizzes.id=scores.quiz_id WHERE scores.user_id = ?",userid).Scan(&perfs)
 c.Header("access-control-allow-origin", "*")
 c.JSON(200,perfs)
}

func LeaderBoard(c *gin.Context){
  genrename := c.Params.ByName("genrename")
  var lboard []Leader
  var genre Genre
  if err := db.Where("genre_name = ?", genrename).First(&genre).Error; err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
  } else {
    db.Raw("SELECT user_name,sum(score) as total_score FROM scores WHERE genre_id= ? GROUP BY user_name ORDER BY total_score DESC",genre.ID).Scan(&lboard)
    c.Header("access-control-allow-origin", "*")
    c.JSON(200,lboard)
  }
}
func easyLeaderBoard(c *gin.Context){
  var lboard []Leader
    db.Raw("SELECT user_name,sum(score) as total_score FROM scores GROUP BY user_name ORDER BY total_score DESC").Scan(&lboard)
    c.Header("access-control-allow-origin", "*")
    c.JSON(200,lboard)
  }

func SetScore(c *gin.Context){
  quizname := c.Params.ByName("quizname")
  userid := c.Params.ByName("userid")
  scorep := c.Params.ByName("score")
  scorex,_ := strconv.Atoi(scorep)
  var user User
  var quiz Quiz
  var genre Genre
  db.Where("id = ?",userid).First(&user)
  db.Where("quiz_name = ?",quizname).First(&quiz)
  db.Where("id = ?",quiz.GenreID).First(&genre)
  var chk_score Score
  if err := db.Where("quiz_id = ? AND user_id = ?",quiz.ID,userid).First(&chk_score).Error;err != nil {
      var score Score
      score.UserID = user.ID
      score.QuizID = quiz.ID
      score.GenreID = genre.ID
      score.UserName = user.UserName
      score.Score = uint(scorex)

      oldscore := user.TotalScore
      newscore := uint(oldscore) + uint(scorex)
      db.Create(&score)
      db.Model(&user).Update("total_score",newscore)
      fmt.Println(score)
      c.Header("access-control-allow-origin", "*")
      c.JSON(200,score)
  } else {
     oldscore := chk_score.Score
     oldtotal := user.TotalScore
     newtotal := uint(oldtotal) - uint(oldscore) + uint(scorex)
     db.Model(&chk_score).Update("score",scorex)
     db.Model(&user).Update("total_score",newtotal)
     c.Header("access-control-allow-origin", "*")
     c.JSON(200,gin.H{"quiz score ": "updated"})
  }
}

func Register(c *gin.Context) {
   var user User
   c.BindJSON(&user)
   fmt.Println(user.Password)
   byte_pass,_ := bcrypt.GenerateFromPassword([]byte(user.Password),bcrypt.DefaultCost)
   user.Password = string(byte_pass)
   fmt.Printf("lolololol")
   fmt.Println(user.Password)
   db.Create(&user)
   c.Header("access-control-allow-origin", "*")
   c.JSON(200,user)
}

func GetGenres(c *gin.Context) {
      var genres []Genre
      if err := db.Find(&genres).Error; err != nil {
         c.AbortWithStatus(404)
         fmt.Println(err)
      } else {
         c.Header("access-control-allow-origin", "*")
         c.JSON(200,genres)
      }
   }


func GetUser(c *gin.Context) {
      id := c.Params.ByName("id")
      var user User
      if err := db.Where("user_id = ?", id).First(&user).Error; err != nil {
         c.AbortWithStatus(404)
         fmt.Println(err)
      } else {
         c.Header("access-control-allow-origin", "*")
         c.JSON(200,user)
      }
   }

func GetUsers(c *gin.Context) {
      var users []User
      if err := db.Find(&users).Error; err != nil {
         c.AbortWithStatus(404)
         fmt.Println(err)
      } else {
         c.Header("access-control-allow-origin", "*")
         c.JSON(200, users)
      }

   }

func GetQuizzes(c *gin.Context){
    genrename := c.Params.ByName("genrename")
    fmt.Println(genrename)
    var genre Genre
    var quizzes []Quiz
    if err := db.Where("genre_name = ?", genrename).First(&genre).Error; err != nil {
      c.AbortWithStatus(404)
      fmt.Println(err)
    } else {
      fmt.Println(genre)
      db.Model(&genre).Related(&quizzes)
      fmt.Println(quizzes)
      c.Header("access-control-allow-origin", "*")
      c.JSON(200,quizzes)
    }
}

func GetQuiz(c *gin.Context){
  quizname := c.Params.ByName("quizname")
  fmt.Println(quizname)
  var quiz Quiz
  var questions []Question

  if err := db.Where("quiz_name = ?", quizname).First(&quiz).Error; err != nil {
    c.AbortWithStatus(404)
    fmt.Println(err)
  } else {
    db.Model(&quiz).Related(&questions)
    for i,q:= range questions{
      var options []Option
      db.Model(&q).Related(&options)
      questions[i].Options = options
    }
      c.Header("access-control-allow-origin", "*")
      c.JSON(200,questions)
  }
}

func CreateGenre(c *gin.Context) {
   var genre Genre
   c.BindJSON(&genre)
   db.Create(&genre)
   c.Header("access-control-allow-origin", "*")
   c.JSON(200,genre)
}

func CreateQuiz(c *gin.Context) {
   genrename := c.Params.ByName("genrename")
   var genre Genre
   if err := db.Where("genre_name = ?", genrename).First(&genre).Error; err != nil {
     c.AbortWithStatus(404)
     fmt.Println(err)
   } else {
   var quiz Quiz
   c.BindJSON(&quiz)
   db.Create(&quiz)
   db.Model(&quiz).UpdateColumn("genre_id",genre.ID)
   c.Header("access-control-allow-origin", "*")
   c.JSON(200,quiz)
 }
}

func CreateQuestion(c *gin.Context) {
   quizname := c.Params.ByName("quizname")
   var quiz Quiz
   if err := db.Where("quiz_name = ?", quizname).First(&quiz).Error; err != nil {
     c.AbortWithStatus(404)
     fmt.Println(err)
   } else {
   var ques Question
   c.BindJSON(&ques)
   db.Create(&ques)
   db.Model(&ques).UpdateColumn("quiz_id",quiz.ID)
   c.Header("access-control-allow-origin", "*")
   c.JSON(200,ques)
 }
}

func CreateOption(c *gin.Context) {
   question := c.Params.ByName("question")
   var q Question
   if err := db.Where("question = ?", question).First(&q).Error; err != nil {
     c.AbortWithStatus(404)
     fmt.Println(err)
   } else {
   var opt Option
   c.BindJSON(&opt)
   db.Create(&opt)
   db.Model(&opt).UpdateColumn("question_id",q.ID)
   c.Header("access-control-allow-origin", "*")
   c.JSON(200,opt)
 }
 }

func Login(c *gin.Context){
  var user User
  c.BindJSON(&user)
  chk_password := user.Password
  fmt.Println(chk_password)

  var chkuser User
  if err := db.Where("user_name = ?",user.UserName).First(&chkuser).Error; err != nil {
     c.AbortWithStatus(404)
     fmt.Println(err)
  } else {
     err := bcrypt.CompareHashAndPassword([]byte(chkuser.Password), []byte(chk_password))
     match := (err == nil)
     fmt.Println(match)
     if match == false{
         c.AbortWithStatus(404)
         fmt.Println("Incorrect Password")
         } else {
     c.Header("access-control-allow-origin", "*")
     c.JSON(200,chkuser)
     }
  }
}

func DeleteUser(c *gin.Context) {
   id := c.Params.ByName("id")
   var user User
   d := db.Where("id = ?", id).Delete(&user)
   fmt.Println(d)
   c.Header("access-control-allow-origin", "*")
   c.JSON(200, gin.H{"id #" + id: "deleted"})
}

func DeleteGenre(c *gin.Context){
  genrename := c.Params.ByName("genrename")
  var genre Genre
  d := db.Where("genre_name = ?",genrename).Delete(&genre)
  fmt.Println(d)
  c.Header("access-control-allow-origin","*")
  c.JSON(200,gin.H{"genre " + genrename: "deleted"})
}

func DeleteQuiz(c *gin.Context){
  quizname := c.Params.ByName("quizname")
  var quiz Quiz
  d := db.Where("quiz_name = ?",quizname).Delete(&quiz)
  fmt.Println(d)
  c.Header("access-control-allow-origin","*")
  c.JSON(200,gin.H{"quiz " + quizname: "deleted"})
}
