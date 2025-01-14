import { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { TypeMetadataFieldOptions } from '../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { type CommonFieldProps } from '..'
import { MetadataFieldsHelper } from '../../../MetadataFieldsHelper'

interface PrimitiveProps extends CommonFieldProps {
  metadataBlockName: string
  compoundParentName?: string
  fieldsArrayIndex?: number
}
export const Primitive = ({
  name,
  compoundParentName,
  metadataBlockName,
  rulesToApply,
  description,
  title,
  watermark,
  type,
  isRequired,
  withinMultipleFieldsGroup,
  fieldsArrayIndex
}: PrimitiveProps) => {
  const { control } = useFormContext()

  const builtFieldName = useMemo(
    () =>
      MetadataFieldsHelper.defineFieldName(
        name,
        metadataBlockName,
        compoundParentName,
        fieldsArrayIndex
      ),
    [name, metadataBlockName, compoundParentName, fieldsArrayIndex]
  )

  const isTextArea = type === TypeMetadataFieldOptions.Textbox

  return (
    <Form.Group controlId={builtFieldName} as={withinMultipleFieldsGroup ? Col : undefined}>
      <Form.Group.Label
        message={description}
        required={isRequired}
        column={!withinMultipleFieldsGroup}
        sm={3}>
        {title}
      </Form.Group.Label>

      <Controller
        name={builtFieldName}
        control={control}
        rules={rulesToApply}
        render={({ field: { onChange, ref }, fieldState: { invalid, error } }) => (
          <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
            <Row>
              <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
                {isTextArea ? (
                  <Form.Group.TextArea
                    onChange={onChange}
                    isInvalid={invalid}
                    placeholder={watermark}
                    data-fieldtype={type}
                    ref={ref}
                  />
                ) : (
                  <Form.Group.Input
                    type="text"
                    onChange={onChange}
                    isInvalid={invalid}
                    placeholder={watermark}
                    data-fieldtype={type}
                    ref={ref}
                  />
                )}

                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            </Row>
          </Col>
        )}
      />
    </Form.Group>
  )
}
