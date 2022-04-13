/* eslint-disable  */
export async function seedDatabase(db, addDoc, setDoc, doc, collection) {
  const users = [
    {
      userId: 'sS173TzGO4T0cqPfimKcbao6DFj2',
      username: 'karl',
      fullName: 'Karl Hadwen',
      emailAddress: 'karlhadwen@gmail.com',
      following: ['2'],
      followers: ['2', '3', '4'],
      dateCreated: Date.now(),
    },
    {
      userId: '2',
      username: 'raphael',
      fullName: 'Raffaello Sanzio da Urbino',
      emailAddress: 'raphael@sanzio.com',
      following: [],
      followers: ['sS173TzGO4T0cqPfimKcbao6DFj2'],
      dateCreated: Date.now(),
    },
    {
      userId: '3',
      username: 'dali',
      fullName: 'Salvador Dalí',
      emailAddress: 'salvador@dali.com',
      following: [],
      followers: ['sS173TzGO4T0cqPfimKcbao6DFj2'],
      dateCreated: Date.now(),
    },
    {
      userId: '4',
      username: 'orwell',
      fullName: 'George Orwell',
      emailAddress: 'george@orwell.com',
      following: [],
      followers: ['sS173TzGO4T0cqPfimKcbao6DFj2'],
      dateCreated: Date.now(),
    },
  ];

  // eslint-disable-next-line prefer-const
  for (let k = 0; k < users.length; k++) {
    const userRef = doc(db, 'users', users[k].username);
    await setDoc(userRef, users[k], { merge: true });
  }

  // eslint-disable-next-line prefer-const
  for (let i = 1; i <= 7; ++i) {
    const photoData = {
      photoId: i,
      userId: '2',
      imageSrc: `/images/users/raphael/${i}.jpg`,
      caption: 'Saint George and the Dragon',
      likes: [],
      comments: [
        {
          displayName: 'dali',
          comment: 'Love this place, looks like my animal farm!',
        },
        {
          displayName: 'orwell',
          comment: 'Would you mind if I used this picture?',
        },
      ],
      userLatitude: '40.7128°',
      userLongitude: '74.0060°',
      dateCreated: Date.now(),
    };
    await addDoc(collection(db, 'photos'), photoData);
  }
}
