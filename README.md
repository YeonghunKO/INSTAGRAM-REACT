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

## ⏳ 진행 기간
2022년 3월 29일 ~ 2022년 6월 3일

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

|   Dashboard - upload post   |   Dashboard - save post     | 
| :-------------------------: |  :-------------------------: | 
| ![Dashboard - upload post](https://user-images.githubusercontent.com/65995664/171991129-e09deb1d-229a-4c13-865b-afec621ed705.gif)| ![Dashboard - save post](https://user-images.githubusercontent.com/65995664/172078062-0124e2ae-7b13-485e-8fd8-70ce5f2e9764.gif) |
|  설명을 적으면 저장 됨       | 

| Dashboard - search user    |  Dashboard - infinite scroll |  
| :-------------------------: |  :-------------------------: | 
| ![dashboard - search user](https://user-images.githubusercontent.com/65995664/172078069-6aa1e0a0-3e4f-4d7d-8794-ccc74ad6372a.gif) | ![dashboard - infinite scroll](https://user-images.githubusercontent.com/65995664/172078073-c326a274-66c6-4663-90c0-1bbc909c3d39.gif) |

|  Dashboard - follow user   |  Dashboard - delete post   |  Dashboard - like and leave comment |
|  :-----------------------: |  :-----------------------: |:----------------------------------: |
| ![dashboard - follow user](https://user-images.githubusercontent.com/65995664/172078081-00fd9728-a813-45ee-a36b-ca361068bd47.gif)| ![dashboard - delete post](https://user-images.githubusercontent.com/65995664/172078078-795ce565-a870-49d9-aaec-087856f8edc2.gif)| ![dashboard - like and leave comment](https://user-images.githubusercontent.com/65995664/172078084-116af0a0-6781-4037-849f-2ff81d77f344.gif)|

| profile - edit profile    |  profile - navigate photo  |  responsive  |
| :-----------------------: | :------------------------: |:-----------: |
| ![profile - edit profile](https://user-images.githubusercontent.com/65995664/172078070-04216c21-de49-43e0-b50e-ad530d402c0f.gif) |![profile - navigate photo](https://user-images.githubusercontent.com/65995664/172078344-562828a3-5496-4507-af14-330216638dec.gif) | ![responsive](https://user-images.githubusercontent.com/65995664/172079393-b84a898c-5b80-441b-889b-60752d5e665e.gif) |



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

<a href="https://www.figma.com/file/EGIcM6r5Bh8aipBJEHt46D/instacoolike---UML?node-id=0%3A1">컴포넌트 위계 보러가기 👈🏻</a>

### 📖TIL와 회고

<a href="https://velog.io/@yhko1992/1l7xushf">TIL와 회고 👈🏻</a>
