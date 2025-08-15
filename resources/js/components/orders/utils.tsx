import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4" />
    case 'shipped':
      return <Truck className="h-4 w-4" />
    case 'processing':
      return <Clock className="h-4 w-4" />
    case 'cancelled':
      return <XCircle className="h-4 w-4" />
    default:
      return null
  }
}

export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed':
      return 'default'
    case 'shipped':
      return 'secondary'
    case 'processing':
      return 'outline'
    case 'cancelled':
      return 'destructive'
    default:
      return 'outline'
  }
}

export const getItemIcon = () => <Package className="h-6 w-6 text-muted-foreground" />

export { Badge }
