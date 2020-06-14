import admin from 'firebase-admin'
import { isNil } from 'ramda'

import { getDailyData } from './api'
import { getToday } from './utils'

const getDatabaseInstance = () => {
  const serviceAccount = process.env.FIRESTORE_SA_KEY

  if (isNil(serviceAccount)) {
    throw Error('Does not provided ServiceAccount')
  }

  const decodedServiceAccount = Buffer.from(serviceAccount, 'base64').toString('utf8')

  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(decodedServiceAccount)),
  })

  return admin.firestore()
}

export const updateDailyData = async () => {
  try {
    // const data = await getDailyData()

    // if (isNil(data)) {
    //   console.info('Empty daily data')
    //   return
    // }

    const db = getDatabaseInstance()
    // const result = await db
    //   .collection('github')
    //   .doc(getToday().format())
    //   .set({
    //     data: 'test',
    //   })
    const result = await db.collection('github').get()
    result.forEach(doc => console.log(doc.data()))
  } catch (e) {
    console.error(e)
  }
}
