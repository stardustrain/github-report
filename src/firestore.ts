import admin from 'firebase-admin'
import { isNil, isEmpty } from 'ramda'
import dayjs from 'dayjs'

import { GeneratedGithubData } from './updateDailyData'

const initializeFirestore = () => {
  const serviceAccount = process.env.FIRESTORE_SA_KEY

  if (isNil(serviceAccount)) {
    throw Error('Does not provided ServiceAccount')
  }

  const parsedServiceAccount = JSON.parse(Buffer.from(serviceAccount, 'base64').toString())

  admin.initializeApp({
    credential: admin.credential.cert(parsedServiceAccount),
  })

  return admin.firestore()
}

export const create = async (data: GeneratedGithubData, date: string) => {
  const db = initializeFirestore()
  const formattedDate = dayjs(date).format()
  const docRef = db.collection('github').doc(formattedDate)
  const doc = {
    data: isEmpty(data) ? null : data,
    date: formattedDate,
  }

  await docRef.set(doc)

  console.info(`Write firestore data: ${JSON.stringify(doc)}`)
}
