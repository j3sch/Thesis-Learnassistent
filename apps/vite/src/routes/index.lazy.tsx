import { createLazyFileRoute } from '@tanstack/react-router'
import { Button, YStack } from 'tamagui'
import { Airplay } from '@tamagui/lucide-icons'

export const Route = createLazyFileRoute('/')({
    component: Index,
})

function Index() {
    return (
        <div className='p-2'>
            <YStack>
                <h3>Welcome Home!</h3>
                <Button alignSelf='center' icon={Airplay} size='$6'>
                    Large
                </Button>
            </YStack>
        </div>
    )
}
