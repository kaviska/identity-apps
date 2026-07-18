/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import AIGeneratedFlowProvider from "@wso2is/admin.flow-builder-core.v1/providers/ai-generated-flow-provider";
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import DeviceRegistrationFlowBuilderCore from "./device-registration-flow-builder-core";

/**
 * Props interface of {@link DeviceRegistrationFlowBuilder}
 */
type DeviceRegistrationFlowBuilderPropsInterface = IdentifiableComponentInterface;
interface DeviceRegistrationFlowBuilderExtendedPropsInterface extends DeviceRegistrationFlowBuilderPropsInterface {
    flowType?: FlowTypes;
}

/**
 * Entry point for the registration flow builder decorated with the necessary providers.
 *
 * @param props - Props injected to the component.
 * @returns DeviceRegistrationFlowBuilder component.
 */
const DeviceRegistrationFlowBuilder: FunctionComponent<DeviceRegistrationFlowBuilderExtendedPropsInterface> = ({
    "data-componentid": componentId = "device-registration-flow-builder",
    flowType = FlowTypes.REGISTRATION,
    ...rest
}: DeviceRegistrationFlowBuilderExtendedPropsInterface): ReactElement => (
    <AIGeneratedFlowProvider>
        <DeviceRegistrationFlowBuilderCore { ...rest } flowType={ flowType } />
    </AIGeneratedFlowProvider>
);

export default DeviceRegistrationFlowBuilder;
