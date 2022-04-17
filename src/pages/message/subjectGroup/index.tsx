// /* eslint-disable jsx-a11y/click-events-have-key-events */
// /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
// // import { joined } from '@/api/subjects';
// // import { useQuery } from 'react-query';
// import styles from './index.less';

// export default function SubjectListD ({ subjectList }: any) {
//   console.log('subjectList: ', subjectList);
//   const choicUser = (e: any) => {
//     console.log(e.target);
//     console.log(e.target.getAttribute('id'));
//     // setUserId(e.target.getAttribute('id'));
//   };
//   const MsgList = () =>
//   subjectList.map((item: any) => (
//     // TODO
//       <div key={Math.random()} className={styles.feedCard}>
//         <div className={styles.feedCardAvatar}>
//           <div className={styles.avatar}>
//             <img
//               id={item.key}
//               onClick={choicUser}
//               onKeyDownCapture={choicUser}
//               src={item.avatar}
//               alt="logo"
//             />
//           </div>
//         </div>
//         <div className={styles.feedCardMain}>
//           <div className={styles.feedCardHeader}>
//             <div className={styles.feedCardName}>
//               <p className={styles.feedCardNameText}>{item.name}</p>
//             </div>
//             {/* (item.create_time) */}
//             <div className={styles.feedCardHeaderTime}>22:45:56</div>
//           </div>
//           <div className={styles.feedMessagePreviewContainer}>
//             <div className={styles.feedMessagePreviewTextOverflow}>
//               <span className={styles.feedMessagePreviewContent}>
//                 好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的好的
//               </span>
//             </div>
//           </div>
//           <div className={styles.feedCardDoneButton}>√</div>
//         </div>
//       </div>
//     ));

//   return <div><MsgList /></div>;
// }
