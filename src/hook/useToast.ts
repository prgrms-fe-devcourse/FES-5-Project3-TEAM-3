import { Flip, toast } from "react-toastify";


export default function useToast(type:string,msg:string) {

  switch (type) {
    case 'success':{
      toast.success(msg, {
        transition: Flip,
      })
      break;
    }
    case 'warn':{
      toast.warn(msg, {
        transition:Flip
      })
      break;
    }
    case 'error': {
      toast.error(msg, {
        transition:Flip
      })
      break;
    }
    case 'info': {
      toast.info(msg, {
        transition: Flip
      })
      break;
    }
  }
}