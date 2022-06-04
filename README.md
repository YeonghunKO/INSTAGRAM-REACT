# 📷Instagramcoolike

<p align="center">
    <img width="
250px" alt="surf_logo" src="https://user-images.githubusercontent.com/65995664/171987349-988dd2c8-007e-4666-bcdf-38e356080ecf.jpg">
</p>


<br>

<p align="center">
친구들과 사진을 공유해보자
    </p>


### ✏️ 이 프로젝트를 시작하게 된 동기

리액트 기술 수준을 심화하고 싶어서 시작하게 되었다. 그러다가 `Karl Hadwen`의 인스타 클론을 발견하게 되었고, 이를 토대로 나만의 기능을 여러개 추가해서 사진 공유 앱을 완성하였다. 게다가 기술 구현뿐 아니라 테스트 까지 배우고 싶어서 시작하게 된 프로젝트이다.

출처:[karl hadwen의 인스타 프로젝트](https://www.youtube.com/watch?v=AKeaaa8yAAk) 

### 📃 프로젝트 진행 과정

- 강의를 보고 그대로 따라하기 보다는 일단 결과물을 보고 내 스스로 코드를 직접 짜보기.
- 하루정도 고민해도 모를경우 강의를 보지말고 깃헙에 올려진 코드를 보고 로직을 파악하기.
- 파악한 로직을 토대로 코드를 다시 짜보기.
- 새롭게 배운 로직, 기술을 문서로 정리하기.
- 내가 짰던 코드에서 부족했던 점 문서로 정리하기.
- 그리고 새롭게 추가하고 싶은 기능을 생각하고 추가하기.
- 기능을 완료했으면 테스트 코드 짜기

<br>

## 🤖기술 스택

### 📚&nbsp;&nbsp;Frameworkes & Libraries

- react
- tailwind
- mui
- react-images-uploading
- react-content-loader
- firebase
- prop-types
- vercel
- jest
- react-testing-library

## 🗣 배포

<a href="https://instagram-react.vercel.app/">프로젝트 보러가기 👈🏻</a>

## 👁‍🗨 데모

|   Dashboard - upload post   |   Dashboard - save post     |  Dashboard - search user    |  Dashboard - infinite scroll |  
| :-------------------------: |  :-------------------------: | :-------------------------: |  :-------------------------: | 
| ![Dashboard - upload post](https://user-images.githubusercontent.com/65995664/171991129-e09deb1d-229a-4c13-865b-afec621ed705.gif)| ![Dashboard - save post]() | ![New Palette - Edit box]() | ![New Palette - Edit box]() | 
|  설명을 적으면 저장 됨       | 

|  Dashboard - follow user   |  Dashboard - delete post   |  Dashboard - like and leave comment |
|  :-----------------------: |  :-----------------------: |:----------------------------------: |
| ![New Palette - Edit box]()|  ![New Palette - Edit box]()| ![New Palette - Edit box]()|

| profile - edit profile    |  profile - navigate photo  |  responsive  |
| :-----------------------: | :------------------------: |:-----------: |
| ![**Edit and Delete Platte**  ]()) |  ![Change background]() |  ![Change background]() |






## 📂 디렉토리 구조

```
src                                             
├─ __tests__                                    
│  └─ pages                                     
│     ├─ dashboard.test.js                      
│     ├─ login.test.js                          
│     ├─ notfound.test.js                       
│     ├─ profile.test.js                        
│     └─ signup.test.js                         
├─ components                                   
│  ├─ InputField                                
│  │  ├─ SuggestedUsers.js                      
│  │  └─ index.js                               
│  ├─ post                                      
│  │  ├─ Actions.js                             
│  │  ├─ AddComments.js                         
│  │  ├─ Comments.js                            
│  │  ├─ Footer.js                              
│  │  ├─ Header.js                              
│  │  └─ index.js                               
│  ├─ profile                                   
│  │  ├─ header.js                              
│  │  ├─ index.js                               
│  │  ├─ photo.js                               
│  │  └─ photos.js                              
│  ├─ sidebar                                   
│  │  ├─ SuggestedProfile.js                    
│  │  ├─ Suggestion.js                          
│  │  ├─ User.js                                
│  │  └─ index.js                               
│  ├─ Header.js                                 
│  ├─ Loader.js                                 
│  └─ Timeline.js                               
├─ constants                                    
│  ├─ path.js                                   
│  └─ routes.js                                 
├─ context                                      
│  ├─ currentUser.js                            
│  ├─ firebase.js                               
│  ├─ isProfileEdited.js                        
│  ├─ loggedInUser.js                           
│  ├─ originalPost.js                           
│  ├─ postPhotos.js                             
│  └─ userFollowing.js                          
├─ fixtures                                     
│  ├─ logged-in-user.js                         
│  ├─ profile-followed-by-loggedin-user.js      
│  ├─ profile-not-followed-by-loggedin-user.js  
│  ├─ profile-photos.js                         
│  ├─ suggested-profiles.js                     
│  ├─ timeline-photos.js                        
│  └─ users-for-inputField.js                   
├─ helpers                                      
│  ├─ ProtectedRoute.js                         
│  ├─ debounce.js                               
│  ├─ getGeoLocation.js                         
│  └─ storage.js                                
├─ hooks                                        
│  ├─ useAuthListener.js                        
│  ├─ usePhotos.js                              
│  ├─ useScroll.js                              
│  ├─ useStateCallback.js                       
│  └─ useUser.js                                
├─ lib                                          
│  └─ firebase.js                               
├─ pages                                        
│  ├─ Dashboard.js                              
│  ├─ Login.js                                  
│  ├─ NotFound.js                               
│  ├─ Profile.js                                
│  └─ Signup.js                                 
├─ services                                     
│  └─ firebase.js                               
├─ styles                                       
│  ├─ Alert.js                                  
│  ├─ PostContainer.style.js                    
│  ├─ app.css                                   
│  └─ tailwind.css                              
├─ App.js                                       
├─ index.js                                     
├─ seed.js                                      
└─ setupTests.js                                
```

### 🔻컴포넌트 위계

<a href="">컴포넌트 위계 보러가기 👈🏻</a>

### 📖TIL와 회고 보러가기!

<a href="">컴포넌트 위계 보러가기 👈🏻</a>
