import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'] | 'car-outline' | 'person-outline' | 'cash-outline' | 'person-circle-outline'; 