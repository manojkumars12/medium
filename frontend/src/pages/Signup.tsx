import { Auth } from '../components/Auth'
import {Quote} from '../components/Quote'
export default function Signup() {
  return <div className='grid grid-cols-1 lg:grid-cols-2'>
    <div><Auth types='signup'/> </div>
    <div className='hidden lg:block'>
    <Quote></Quote>
    </div>
  </div>
}